import { NextRequest, NextResponse } from 'next/server'
import { stripe } from '@/lib/stripe'
import { db } from '@/lib/db'
import Stripe from 'stripe'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = req.headers.get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (error) {
    console.error('Webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated': {
        const subscription = event.data.object as Stripe.Subscription
        
        const user = await db.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        })
        
        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              subscriptionId: subscription.id,
              subscriptionStatus: subscription.status,
              plan: subscription.status === 'active' ? 'pro' : 'free',
            },
          })
        }
        break
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object as Stripe.Subscription
        
        const user = await db.user.findFirst({
          where: { stripeCustomerId: subscription.customer as string },
        })
        
        if (user) {
          await db.user.update({
            where: { id: user.id },
            data: {
              subscriptionId: null,
              subscriptionStatus: null,
              plan: 'free',
            },
          })
        }
        break
      }

      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          const user = await db.user.findFirst({
            where: { stripeCustomerId: invoice.customer as string },
          })
          
          if (user) {
            await db.user.update({
              where: { id: user.id },
              data: {
                plan: 'pro',
                subscriptionStatus: 'active',
              },
            })
          }
        }
        break
      }

      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice
        
        if (invoice.subscription) {
          const user = await db.user.findFirst({
            where: { stripeCustomerId: invoice.customer as string },
          })
          
          if (user) {
            await db.user.update({
              where: { id: user.id },
              data: {
                subscriptionStatus: 'past_due',
              },
            })
          }
        }
        break
      }
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}