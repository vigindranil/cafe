'use client';

import { useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { Instagram, Facebook, Twitter, ChevronDown, Coffee, Croissant, Heading as Bread, Youtube, Heart, MessageCircle, Share2 } from 'lucide-react';
import Image from 'next/image';

export default function Home() {
  const { scrollYProgress } = useScroll();
  const menuRef = useRef(null);
  const [menuRef1, inView] = useInView({
    triggerOnce: true,
    threshold: 0.1,
  });

  const springConfig = { stiffness: 100, damping: 30, bounce: 0 };
  const scale = useSpring(useTransform(scrollYProgress, [0, 1], [1, 0.8]), springConfig);
  const y = useSpring(useTransform(scrollYProgress, [0, 1], [0, -100]), springConfig);
  const opacity = useSpring(useTransform(scrollYProgress, [0, 0.2], [1, 0]));

  const handleMenuClick = () => {
    menuRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const menuCategories = [
    {
      title: "Signature Breads",
      icon: Bread,
      items: [
        { name: "Artisan Sourdough", price: "₹180", description: "24-hour fermented, stone-baked" },
        { name: "Ancient Grain Loaf", price: "₹220", description: "Blend of 7 heritage grains" },
        { name: "Golden Baguette", price: "₹160", description: "Traditional French recipe" },
        { name: "Olive Focaccia", price: "₹240", description: "Italian herbs, premium olive oil" },
      ]
    },
    {
      title: "Patisserie Collection",
      icon: Croissant,
      items: [
        { name: "Classic Croissant", price: "₹180", description: "French butter, 36-hour process" },
        { name: "Pistachio Danish", price: "₹220", description: "House-made pistachio cream" },
        { name: "Dark Chocolate Pain", price: "₹200", description: "70% single-origin chocolate" },
        { name: "Berry Choux", price: "₹240", description: "Seasonal berries, Chantilly cream" },
      ]
    },
    {
      title: "Artisanal Coffee",
      icon: Coffee,
      items: [
        { name: "Single Origin Espresso", price: "₹180", description: "Brazilian Santos" },
        { name: "Pour Over Selection", price: "₹240", description: "Ethiopian Yirgacheffe" },
        { name: "Nitro Cold Brew", price: "₹220", description: "24-hour steep" },
        { name: "Signature Mocha", price: "₹260", description: "House-made chocolate ganache" },
      ]
    }
  ];

  const menuItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    })
  };

  const socialPosts = [
    {
      platform: 'Instagram',
      image: 'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085',
      likes: 1234,
      comments: 56,
      shares: 23,
      caption: 'Start your morning right with our freshly baked artisan bread 🥖✨'
    },
    {
      platform: 'Instagram',
      image: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93',
      likes: 2345,
      comments: 78,
      shares: 45,
      caption: 'Perfect latte art to brighten your day ☕️💫'
    },
    {
      platform: 'Instagram',
      image: 'https://images.unsplash.com/photo-1509365465985-25d11c17e812',
      likes: 3456,
      comments: 90,
      shares: 67,
      caption: 'Our signature croissants, made with love 🥐❤️'
    }
  ];

  return (
    <div className="relative">
      {/* Hero Section */}
      <motion.section className="relative h-screen flex items-center justify-center overflow-hidden">
        <motion.div
          className="absolute inset-0"
          style={{ scale, y }}
        >
          <Image
            src="https://images.unsplash.com/photo-1600093463592-8e36ae95ef56?auto=format&fit=crop&q=80"
            alt="Café ambiance"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/20" />
        </motion.div>

        <motion.div
          className="relative z-10 text-center text-white"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.5, ease: [0.645, 0.045, 0.355, 1] }}
        >
          <motion.h1
            className="text-8xl font-bold mb-8 text-gradient-animate"
            style={{ opacity }}
          >
            Artisan Café
          </motion.h1>
          <motion.p
            className="text-2xl mb-12 tracking-wide"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 1 }}
          >
            Crafting moments of pure delight
          </motion.p>
          <motion.button
            className="apple-button"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleMenuClick}
          >
            Discover Our Menu
          </motion.button>
        </motion.div>

        <motion.div
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <ChevronDown className="w-8 h-8 text-white" />
        </motion.div>
      </motion.section>

      {/* Menu Section */}
      <section ref={menuRef} className="py-32 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-24"
          >
            <h2 className="text-6xl font-bold mb-6 text-gray-900">Our Creations</h2>
            <div className="w-24 h-1 bg-amber-500 mx-auto" />
          </motion.div>

          <div className="grid gap-16">
            <AnimatePresence>
              {menuCategories.map((category, index) => (
                <motion.div
                  key={index}
                  ref={menuRef1}
                  className="menu-card"
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  transition={{ duration: 0.8, delay: index * 0.2 }}
                >
                  <div className="p-12">
                    <div className="flex items-center gap-4 mb-8">
                      <category.icon className="w-8 h-8 text-amber-500" />
                      <h3 className="text-3xl font-bold text-gray-900">{category.title}</h3>
                    </div>
                    <div className="grid md:grid-cols-2 gap-8">
                      {category.items.map((item, itemIndex) => (
                        <motion.div
                          key={itemIndex}
                          custom={itemIndex}
                          variants={menuItemVariants}
                          initial="hidden"
                          whileInView="visible"
                          viewport={{ once: true }}
                          className="menu-item"
                        >
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl font-semibold text-gray-900">{item.name}</h4>
                            <span className="text-lg font-medium text-amber-600">{item.price}</span>
                          </div>
                          <p className="text-gray-600">{item.description}</p>
                          <motion.div
                            className="absolute inset-0 bg-amber-50 rounded-xl"
                            initial={{ opacity: 0 }}
                            whileHover={{ opacity: 1 }}
                            transition={{ duration: 0.3 }}
                          />
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      </section>

      {/* Social Media Feed Section */}
      <section className="py-32 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-bold mb-6 text-gray-900">Social Feed</h2>
            <p className="text-xl text-gray-600 mb-8">Follow us for daily inspiration</p>
            <div className="flex justify-center gap-6 mb-12">
              {[
                { icon: Instagram, color: 'bg-gradient-to-tr from-purple-600 to-pink-600', link: '#' },
                { icon: Facebook, color: 'bg-blue-600', link: '#' },
                { icon: Twitter, color: 'bg-sky-500', link: '#' },
                { icon: Youtube, color: 'bg-red-600', link: '#' }
              ].map((social, index) => (
                <motion.a
                  key={index}
                  href={social.link}
                  className={`${social.color} p-4 rounded-full text-white shadow-lg hover:shadow-xl transition-shadow duration-300`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {socialPosts.map((post, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-3xl shadow-xl overflow-hidden hover:shadow-2xl transition-shadow duration-300"
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.2 }}
              >
                <div className="relative aspect-square">
                  <Image
                    src={post.image}
                    alt="Social media post"
                    fill
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                    <p className="text-white text-sm">{post.caption}</p>
                  </div>
                </div>
                <div className="p-6">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 text-rose-500"
                      >
                        <Heart className="w-5 h-5" />
                        <span>{post.likes}</span>
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="flex items-center gap-2 text-blue-500"
                      >
                        <MessageCircle className="w-5 h-5" />
                        <span>{post.comments}</span>
                      </motion.button>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="text-gray-500"
                    >
                      <Share2 className="w-5 h-5" />
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <motion.div
            className="text-center mt-12"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.5 }}
          >
            <a
              href="#"
              className="inline-flex items-center gap-2 text-amber-600 hover:text-amber-700 font-semibold"
            >
              View More Posts
              <motion.span
                animate={{ x: [0, 5, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </a>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="relative py-32 bg-black text-white overflow-hidden">
        <motion.div
          className="absolute inset-0 opacity-30"
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
          style={{
            backgroundImage: 'url("data:image/svg+xml,%3Csvg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg"%3E%3Cg fill="none" fill-rule="evenodd"%3E%3Cg fill="%239C92AC" fill-opacity="0.4"%3E%3Cpath d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")',
          }}
        />
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-6xl font-bold mb-6">Visit Us</h2>
            <div className="w-24 h-1 bg-white mx-auto" />
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-16"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
          >
            <div className="space-y-8">
              <div>
                <h3 className="text-2xl font-bold mb-4">Location</h3>
                <p className="text-xl">123 Artisan Street</p>
                <p className="text-xl">Kolkata, West Bengal</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Hours</h3>
                <p>Monday - Sunday: 7:00 AM - 10:00 PM</p>
              </div>
              <div>
                <h3 className="text-2xl font-bold mb-4">Contact</h3>
                <p>+91 123 456 7890</p>
                <p>hello@artisancafe.com</p>
              </div>
            </div>

            <motion.div
              className="flex flex-col justify-center"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
            >
              <h3 className="text-2xl font-bold mb-8">Follow Us</h3>
              <div className="flex space-x-6">
                {[Instagram, Facebook, Twitter].map((Icon, index) => (
                  <motion.a
                    key={index}
                    href="#"
                    className="magnetic p-4 rounded-full bg-white/10 hover:bg-white/20"
                    whileHover={{ scale: 1.1, y: -5 }}
                  >
                    <Icon className="w-6 h-6" />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}