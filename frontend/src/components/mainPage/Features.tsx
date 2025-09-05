"use client";
import React, { useEffect, useRef, useState } from "react";
import { Cabin, Rethink_Sans, Inter } from 'next/font/google';
import { motion } from 'framer-motion';
import { Target, Video, MessageCircle, Brain, MonitorStop } from 'lucide-react';
import Image from "next/image";

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

const rethinkSans = Rethink_Sans({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

const inter = Inter({
    subsets: ['latin'],
    weight: ['400', '500', '600'],
    display: 'swap',
});


const features = [
    {
        id: 1,
        title: "AI Based Matching",
        description: "Connect with people who share your interests and goals using our advanced AI matching algorithm. Find the perfect co-founder, mentor, or team member for your startup journey.",
        icon: Brain,
        svg: "ai-matching.svg",
    },
    {
        id: 2,
        title: "Instant Video Roulette",
        description: "Jump into real-time video conversations with potential partners instantly. Our video roulette connects you with like-minded entrepreneurs for spontaneous brainstorming sessions.",
        icon: MonitorStop,
        svg: "groupvideo.svg",
    },
    {
        id: 3,
        title: "Instant Friending & Messages",
        description: "Build meaningful connections instantly with our seamless messaging system. Share ideas, exchange contacts, and start collaborating with new friends in real-time.",
        icon: MessageCircle,
        svg: "chatinterface.svg",
    }
];

const Features = () => {
    const pathRef = useRef<SVGPathElement | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [mounted, setMounted] = useState(false);
    const [ready, setReady] = useState(false);

    const CONTINUOUS_PATH = `
        M 600 250
        C 650 250, 700 250, 720 300
        C 740 350, 720 400, 680 450
        C 640 500, 600 520, 550 540
        C 500 560, 450 580, 400 600
        C 350 620, 300 640, 250 660
        C 200 680, 150 700, 120 750
        C 90 800, 120 850, 160 880
        C 200 910, 250 920, 300 930
        C 350 940, 400 950, 450 960
        C 500 970, 550 980, 600 990
        C 650 1000, 700 1010, 720 1060
        C 740 1110, 720 1160, 680 1210
        C 640 1260, 600 1280, 550 1300
        C 500 1320, 450 1340, 400 1360
        C 350 1380, 300 1400, 250 1420
        C 200 1440, 150 1460, 120 1510
        C 90 1560, 120 1610, 200 1700
        C 280 1790, 240 1780, 200 1795
    `;

    useEffect(() => {
        setMounted(true);
    }, []);

    useEffect(() => {
        if (!sectionRef.current) return;
        const imgs = Array.from(sectionRef.current.querySelectorAll('img')) as HTMLImageElement[];
        if (imgs.length === 0) {
            setReady(true);
            return;
        }
        let remaining = imgs.filter((i) => !i.complete).length;
        if (remaining === 0) {
            window.setTimeout(() => setReady(true), 60);
            return;
        }
        const onLoad = () => {
            remaining -= 1;
            if (remaining <= 0) {
                window.setTimeout(() => setReady(true), 60);
            }
        };
        imgs.forEach((img) => img.addEventListener('load', onLoad, { once: true }));
        return () => imgs.forEach((img) => img.removeEventListener('load', onLoad));
    }, []);

    useEffect(() => {
        if (!pathRef.current || !sectionRef.current) return;

        const length = pathRef.current.getTotalLength();
        pathRef.current.style.strokeDasharray = `${length}`;
        pathRef.current.style.strokeDashoffset = `${length}`;

        const onScroll = () => {
            if (!ready) return;
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const sectionTop = sectionRef.current!.offsetTop;
            const sectionHeight = sectionRef.current!.offsetHeight;

            let progress = (scrollY + viewportHeight - sectionTop) / sectionHeight;
            const startOffset = 0.1;
            if (progress < startOffset) progress = 0;
            else progress = (progress - startOffset) / (1 - startOffset);
            progress = Math.min(Math.max(progress, 0), 1);

            const drawLength = length * progress;
            pathRef.current!.style.strokeDashoffset = `${length - drawLength}`;
        };

        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onScroll);
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [ready]);


    const title = "Features";
    const containerVariants = {
        hidden: {},
        visible: { transition: { staggerChildren: 0.03, delayChildren: 0.05 } }
    };
    const letterVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1 }
    };

    return (
            <section
                ref={sectionRef}
                className="bg-gray-50 min-h-screen py-20 relative overflow-hidden"
                style={{ height: "275vh" }}
            >
            <div className="absolute bottom-0 inset-x-0 h-20 bg-gradient-to-t from-gray-50 via-white to-transparent z-10" />
            <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-white to-gray-100" />            
            <svg
                width="100%"
                height="100%"
                className="absolute top-0 left-0 pointer-events-none"
                viewBox="0 0 800 1800"
                preserveAspectRatio="xMidYMin meet"
            >
                <defs>
                    <filter id="subtleGlow">
                        <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
                        <feMerge> 
                            <feMergeNode in="coloredBlur"/>
                            <feMergeNode in="SourceGraphic"/>
                        </feMerge>
                    </filter>
                </defs>
                <path
                    ref={pathRef}
                    d={CONTINUOUS_PATH}
                    stroke="#298dd4"
                    strokeWidth="2"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    filter="url(#subtleGlow)"
                    style={{ 
                        transition: "stroke-dashoffset 0.06s linear"
                    }}
                />
            </svg>

            <div className="max-w-7xl mx-auto px-4 relative z-10">
                <div className="text-center mb-20 py-3">
                    <motion.h2 
                        className={`${rethinkSans.className}  text-6xl font-bold text-gray-900 mb-6`}
                        variants={containerVariants}
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {Array.from(title).map((ch, idx) => (
                            <motion.span key={idx} variants={letterVariants} className="inline-block">
                                {ch}
                            </motion.span>
                        ))}
                    </motion.h2>
                </div>

                <div className="space-y-32">
                    {features.map((feature, index) => {
                        const IconComponent = feature.icon;
                        return (
                            <motion.div
                                key={feature.id}
                                className={`flex items-center gap-16 ${
                                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                                }`}
                                initial={{ opacity: 0, y: 100 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: 100 }}
                                transition={{ duration: 0.8 }}
                                viewport={{ once: false, amount: 0.3 }}
                            >
                                <div className="flex-1 space-y-6 pb-20">
                                    <div className="flex items-center gap-6">
                                        <div className={`w-12 h-12 rounded-md border-[1px] border-[#c9c9c9] text-blue-700 bg-[#f0f0f0] flex items-center justify-center shadow-lg`}>
                                            <IconComponent className="w-8 h-8" strokeWidth={2} />
                                        </div>
                                        <h3 className={`${rethinkSans.className} text-[34px] font-bold text-gray-900`}>
                                            {feature.title}
                                        </h3>
                                    </div>
                                    <p className={`${inter.className} text-[18px] text-gray-600 leading-relaxed`}>
                                        {feature.description}
                                    </p>
                                </div>

                                <div className="flex-1 flex justify-center w-fit h-fit">
                                    <div className="relative w-[400px] h-[350px] opacity-100 rounded-md bg-white/20 backdrop-blur-xl border-2 border-white/30 shadow-xl overflow-hidden p-8">
                                        <Image
                                            fill
                                            src={`/assets/${feature.svg}`}
                                            alt={feature.title}
                                            className="object-contain" 
                                        />
                                    </div>
                                </div>

                            </motion.div>
                        );
                    })}
                    </div>
                </div>
            </section>
        );
    };

export default Features;
