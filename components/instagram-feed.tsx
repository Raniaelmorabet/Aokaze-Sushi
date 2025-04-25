"use client"

import Image from "next/image"
import { motion } from "framer-motion"
import { Heart, MessageCircle, Instagram } from "lucide-react"

export function InstagramFeed({ posts }) {
  return (
    <div>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {posts.map((post, index) => (
          <motion.div
            key={post.id}
            className="relative group overflow-hidden rounded-lg"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <div className="aspect-square">
              <Image
                src={post.image || "/placeholder.svg"}
                alt={`Instagram post ${index + 1}`}
                width={400}
                height={400}
                className="w-full h-full object-cover"
              />
            </div>

            <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
              <div className="flex justify-end">
                <Instagram size={20} className="text-white" />
              </div>

              <div>
                <p className="text-white text-sm line-clamp-2 mb-2">{post.caption}</p>
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1">
                    <Heart size={16} className="text-red-500" />
                    <span className="text-white text-xs">{post.likes}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MessageCircle size={16} className="text-white" />
                    <span className="text-white text-xs">{post.comments}</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-10 text-center">
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white px-6 py-3 rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-300"
        >
          <Instagram size={20} />
          Follow @Aokaäze
        </a>
      </div>
    </div>
  )
}
