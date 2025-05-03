"use client";

import { urlFor } from "@/app/lib/sanity"; 
import { simpleBlogCard } from "@/app/lib/interface";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { useLanguage } from "@/app/components/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from 'next/navigation';
import { useState, useEffect } from "react";
import {useMediaQuery} from '@mui/material'
import TagComponent from "./tagComponent";
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';




interface ClientComponentProps {
  data: simpleBlogCard[];
}

const ClientComponent = ({ data }: ClientComponentProps) => {
  const { language } = useLanguage();
  const pathname = usePathname(); 
  const [isAnimating, setIsAnimating] = useState(false);
  const [destination, setDestination] = useState<string | null>(null);
  const isMobile = useMediaQuery('(max-width:768px)');


  const Title = language === 'JP' ? "こんにちは、Kenjiと申します。Unity を軸に、ゲームと AR 体験のプロトタイプ開発に取り組んでいます。" 
    : language === 'HK' ? "你好，我係 Kenji 一位以 Unity 為核心、專注於遊戲與 AR 體驗開發的原型創作者。" 
    : "Hi, I’m Kenji — a Unity-based Game & AR Developer with a prototype mindset.";
  
  const Description = language === 'JP' ? "このブログでは、ゲームロジック、視覚的なフィードバック、操作のリズムを重視したインタラクティブシステムの設計を通して、私の思考プロセスや技術的な試行錯誤、創作の過程を共有しています。全ては「手を動かしながら考える」実践的なアプローチで構築されています。" 
    : language === 'HK' ? "我設計的互動系統強調遊玩邏輯、視覺回饋與操作節奏。這個 Blog 記錄了我在遊戲機制、即時特效、AR 介面等範疇中的技術實驗與創意過程 —— 所有內容皆來自於實作中的反覆調整與直覺驅動的探索。" 
    : "I design interactive systems with gameplay logic, visual feedback, and user rhythm in mind. This blog is where I share my thoughts, technical experiments, and creative processes across game mechanics, real-time VFX, and AR interfaces — all developed with a hands-on, iterative approach.";
    

    const [selectedType, setSelectedType] = useState('all');

    const [filteredData, setFilteredData] = useState(data);
    const [isLoading, setIsLoading] = useState(false);

    const handleCardClick = (slug: string) => {
      setIsAnimating(true); 
      setDestination(`/blog/${slug}?lang=${language}`); 
    };

    useEffect(() => {
     
      setIsLoading(true);
  
      const timeoutId = setTimeout(() => {
        const newFilteredData = selectedType === 'all'
          ? data
          : data.filter(post => post.type === selectedType);
        
        setFilteredData(newFilteredData);
        setIsLoading(false);
      }, 500);
  
      return () => clearTimeout(timeoutId);
    }, [selectedType]);
  

    useEffect(() => {
      if (destination) {
        const timeout = setTimeout(() => {
          window.location.href = destination;
        }, 100); 
  
        return () => clearTimeout(timeout);
      }
    }, [destination]);

  return (
    <div>
      <AnimatePresence>
        {!isAnimating && (
          <motion.div
            key="content-enter"
            initial={{ x: isMobile ? 300 : 555, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0, 0.71, 0.2, 1.01]
            }}
          >
            <h1 className="flex justify-center  p-5">{Title}</h1>
            <h1 className="flex justify-center text-sm text-gray-600 dark:text-gray-300 p-5">{Description}</h1>

            
            <TagComponent onTagChange={(tag) => setSelectedType(tag)} />

            {/* test card */}

          </motion.div>
        )}

        {isAnimating && (
          
          <motion.div
            key="content-exit"
            initial={{ x: 0, opacity: 1  }}
            animate={{ x: isMobile ? -300 : -555, opacity: 0 }}
            exit={{ x: isMobile ? -300 : -555, opacity: 0 }}
            transition={{
              duration: 0.8,
              delay: 0.25,
              ease: [0, 0.71, 0.2, 1.01]
            }}
          >
            <h1 className="flex justify-center">{Title}</h1>
            <br />
            <h1 className="flex justify-center text-sm text-gray-600 dark:text-gray-300">{Description}</h1>
            
          </motion.div>
        )}
      </AnimatePresence>

      {isLoading ? (
        <div className="loading-screen">
          <Box sx={{ width: '100%', position: 'fixed', bottom: 0, left: 0 }}>

           <LinearProgress />
            </Box>
          </div>
      ) : (

      <div className="grid grid-cols-1 md:grid-cols-1 mt-4 gap-5 mb-16">
        {filteredData.map((post) => {
          const CardTitle = language === 'JP' ? post.title_JP : language === 'HK' ? post.title_TW : post.title_EN;
          const CardDescription = language === 'JP' ? post.smallDescription_JP : language === 'HK' ? post.smallDescription_TW : post.smallDescription_EN;
          const imageUrl = post.titleImage ? urlFor(post.titleImage).url() : "/";
          
         

          return (
            <AnimatePresence key={post.currentSlug}>
              {!isAnimating && (
                <motion.div 
                  key={post.currentSlug} // Ensure key is unique
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{
                    duration: 0.8,
                    delay: 0,
                    ease: [0, 0.71, 0.2, 1.01]
                  }}
                >
                  <motion.div
                    className="box"
                    whileHover={{ scale: .95, rotate: .5 }}
                    whileTap={{ scale: 1.05, rotate: -.5 }}
                    transition={{ type: "spring", stiffness: 400, damping: 17 }}
                    onClick={() => handleCardClick(post.currentSlug)} // Replace Link's default behavior
                  >
                    <Card>
                      <Image src={imageUrl} alt="" width={1200} height={700} className="rounded-t-lg h-[300px] object-cover" />
                      <CardContent className="mt-5">
                        <h3 className="text-xl line-clamp-2 font-bold">{CardTitle}</h3>
                        <p className="line-clamp-1 text-xs mt-1 text-blue-600">{post.type}</p>
                        <p className="text-xs mt-1 text-gray-500">
                          {new Date(post.date).toLocaleDateString(language, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric',
                          })}
                        </p>
                        <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300">{CardDescription}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                </motion.div>
              )}

              {isAnimating && (
                <motion.div 
                  key={post.currentSlug} // Ensure key is unique
                  initial={{ opacity: 1  }}
                  animate={{ opacity: 0}}
                  transition={{
                    duration: 0.8,
                    delay: 0,
                    ease: [0, 0.71, 0.2, 1.01]
                  }}
                >
                  <Card>
                    <Image src={imageUrl} alt="" width={1200} height={700} className="rounded-t-lg h-[300px] object-cover" />
                    <CardContent className="mt-5">
                      <h3 className="text-xl line-clamp-2 font-bold">{CardTitle}</h3>
                      <p className="line-clamp-1 text-xs mt-1 text-blue-600">#{post.type}</p>
                      <p className="text-xs mt-1 text-gray-500">
                        {new Date(post.date).toLocaleDateString(language, {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                      <p className="line-clamp-3 text-sm mt-2 text-gray-600 dark:text-gray-300">{CardDescription}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              )}
            </AnimatePresence>
          );
        })}
      </div>
      )}
    </div>
  );
};

export default ClientComponent;
