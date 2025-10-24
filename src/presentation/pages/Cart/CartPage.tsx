import { useState } from 'react'
import { motion } from 'framer-motion'
import { MainLayout } from '@/presentation/components/layout/MainLayout'
import {
  Trash2,
  Plus,
  Minus,
  ShoppingBag,
  Tag,
  CreditCard,
  Truck,
  Shield,
  Heart,
  ArrowRight,
  Gift,
} from 'lucide-react'
import { Button } from '@/presentation/components/ui/button'
import { Input } from '@/presentation/components/ui/input'
import { Badge } from '@/presentation/components/ui/badge'
import { Card } from '@/presentation/components/ui/card'
import { Separator } from '@/presentation/components/ui/separator'
import { Link } from 'react-router-dom'

const cartItems = [
  {
    id: 1,
    name: 'Silk Midi Dress',
    brand: 'Reformation',
    color: 'Sage Green',
    size: 'M',
    price: 248.0,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop',
    inStock: true,
  },
  {
    id: 2,
    name: 'Leather Ankle Boots',
    brand: 'Sam Edelman',
    color: 'Black',
    size: '8',
    price: 175.0,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=400&h=500&fit=crop',
    inStock: true,
  },
  {
    id: 3,
    name: 'Oversized Blazer',
    brand: 'Zara',
    color: 'Camel',
    size: 'L',
    price: 129.0,
    quantity: 1,
    image: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=400&h=500&fit=crop',
    inStock: true,
  },
]

export const CartPage = () => {
  const [items, setItems] = useState(cartItems)
  const [promoCode, setPromoCode] = useState('')
  const [promoApplied, setPromoApplied] = useState(false)

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const shipping = subtotal > 200 ? 0 : 15.0
  const discount = promoApplied ? subtotal * 0.1 : 0
  const tax = (subtotal - discount) * 0.08
  const total = subtotal + shipping - discount + tax

  const updateQuantity = (id: number, delta: number) => {
    setItems(
      items
        .map((item) =>
          item.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item
        )
        .filter((item) => item.quantity > 0)
    )
  }

  const removeItem = (id: number) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const applyPromo = () => {
    if (promoCode.toLowerCase() === 'curator10') {
      setPromoApplied(true)
    }
  }

  return (
    <MainLayout>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-7xl space-y-6"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-bold text-brand-charcoal">Shopping Cart</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {items.length} {items.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <Link to="/home">
            <Button variant="outline">Continue Shopping</Button>
          </Link>
        </div>

        {items.length === 0 ? (
          /* Empty Cart State */
          <Card className="p-12 text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mx-auto max-w-md space-y-4"
            >
              <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-crimson/10">
                <ShoppingBag className="h-10 w-10 text-brand-crimson" />
              </div>
              <h2 className="font-heading text-2xl font-bold text-brand-charcoal">
                Your cart is empty
              </h2>
              <p className="text-muted-foreground">
                Discover your next favorite outfit with our AI-powered recommendations
              </p>
              <Link to="/home">
                <Button className="bg-brand-crimson hover:bg-brand-crimson/90">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </motion.div>
          </Card>
        ) : (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Cart Items */}
            <div className="space-y-4 lg:col-span-2">
              {items.map((item, index) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  exit={{ opacity: 0, x: -20 }}
                >
                  <Card className="p-4 transition-shadow hover:shadow-lg">
                    <div className="flex gap-4">
                      {/* Item Image */}
                      <div className="relative h-32 w-24 shrink-0 overflow-hidden rounded-lg bg-brand-beige">
                        <img
                          src={item.image}
                          alt={item.name}
                          className="h-full w-full object-cover"
                        />
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => removeItem(item.id)}
                          className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-red-500 text-white shadow-lg hover:bg-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </motion.button>
                      </div>

                      {/* Item Details */}
                      <div className="flex flex-1 flex-col justify-between">
                        <div className="space-y-1">
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <h3 className="font-semibold text-brand-charcoal">{item.name}</h3>
                              <p className="text-sm text-muted-foreground">{item.brand}</p>
                            </div>
                            <p className="font-semibold text-brand-charcoal">
                              ${item.price.toFixed(2)}
                            </p>
                          </div>
                          <div className="flex gap-4 text-xs text-muted-foreground">
                            <span>Color: {item.color}</span>
                            <span>Size: {item.size}</span>
                          </div>
                          {item.inStock ? (
                            <Badge className="bg-brand-blue/10 text-brand-blue hover:bg-brand-blue/20">
                              In Stock
                            </Badge>
                          ) : (
                            <Badge variant="destructive">Out of Stock</Badge>
                          )}
                        </div>

                        {/* Quantity Controls */}
                        <div className="flex items-center gap-3">
                          <div className="flex items-center rounded-lg border">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, -1)}
                              className="p-2 transition-colors hover:bg-muted"
                            >
                              <Minus className="h-3 w-3" />
                            </motion.button>
                            <span className="w-12 text-center text-sm font-medium">
                              {item.quantity}
                            </span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => updateQuantity(item.id, 1)}
                              className="p-2 transition-colors hover:bg-muted"
                            >
                              <Plus className="h-3 w-3" />
                            </motion.button>
                          </div>
                          <Button variant="ghost" size="sm">
                            <Heart className="mr-2 h-4 w-4" />
                            Save for Later
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}

              {/* Promo Code */}
              <Card className="p-4">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      placeholder="Enter promo code"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                      className="pl-10"
                      disabled={promoApplied}
                    />
                  </div>
                  <Button
                    onClick={applyPromo}
                    disabled={promoApplied}
                    className="bg-brand-blue hover:bg-brand-blue/90"
                  >
                    {promoApplied ? 'Applied' : 'Apply'}
                  </Button>
                </div>
                {promoApplied && (
                  <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-sm text-brand-blue"
                  >
                    Promo code applied! You saved ${discount.toFixed(2)}
                  </motion.p>
                )}
              </Card>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-6 space-y-4">
                <Card className="border-brand-crimson/20 p-6 shadow-lg">
                  <h2 className="font-heading mb-4 text-xl font-bold text-brand-charcoal">
                    Order Summary
                  </h2>

                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Subtotal</span>
                      <span className="font-medium">${subtotal.toFixed(2)}</span>
                    </div>

                    {promoApplied && (
                      <div className="flex justify-between text-brand-blue">
                        <span>Discount (10%)</span>
                        <span>-${discount.toFixed(2)}</span>
                      </div>
                    )}

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Shipping</span>
                      <span className="font-medium">
                        {shipping === 0 ? (
                          <Badge className="bg-brand-blue/10 text-brand-blue">FREE</Badge>
                        ) : (
                          `$${shipping.toFixed(2)}`
                        )}
                      </span>
                    </div>

                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Tax</span>
                      <span className="font-medium">${tax.toFixed(2)}</span>
                    </div>

                    <Separator />

                    <div className="flex justify-between text-lg font-bold">
                      <span>Total</span>
                      <span className="text-brand-crimson">${total.toFixed(2)}</span>
                    </div>
                  </div>

                  <Link to="/checkout">
                    <Button className="mt-6 h-12 w-full bg-brand-crimson hover:bg-brand-crimson/90">
                      <CreditCard className="mr-2 h-5 w-5" />
                      Proceed to Checkout
                    </Button>
                  </Link>
                </Card>

                {/* Benefits */}
                <Card className="bg-gradient-to-br from-brand-ivory to-brand-beige p-4">
                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-brand-crimson/10 p-2">
                        <Truck className="h-4 w-4 text-brand-crimson" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-charcoal">Free Shipping</p>
                        <p className="text-xs text-muted-foreground">On orders over $200</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-brand-blue/10 p-2">
                        <Shield className="h-4 w-4 text-brand-blue" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-charcoal">Secure Payment</p>
                        <p className="text-xs text-muted-foreground">Your data is protected</p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="rounded-full bg-brand-crimson/10 p-2">
                        <Gift className="h-4 w-4 text-brand-crimson" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-brand-charcoal">Easy Returns</p>
                        <p className="text-xs text-muted-foreground">30-day return policy</p>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </div>
        )}
      </motion.div>
    </MainLayout>
  )
}
