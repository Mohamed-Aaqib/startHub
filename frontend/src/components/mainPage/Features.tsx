"use client";
import React, { useEffect, useRef, useState } from "react";
import { Cabin } from 'next/font/google';

const cabin = Cabin({
    subsets: ['latin'],
    weight: ['400', '500', '700'],
    display: 'swap',
});

const PATH_D = `
    M 450 0
    C 450 50, 430 100, 460 150
    C 480 200, 420 250, 450 300
    C 480 350, 500 370, 470 420
    C 430 470, 520 500, 480 540
    C 450 570, 460 620, 450 700
    C 440 750, 470 800, 460 850
    C 480 900, 440 950, 450 1000
    C 460 1050, 420 1100, 450 1150
    C 470 1200, 430 1250, 460 1300
    C 480 1350, 440 1400, 450 1450
    C 460 1500, 420 1550, 450 1600
    C 470 1650, 430 1700, 460 1750
    C 480 1800, 440 1850, 450 1900
    C 460 1950, 420 2000, 450 2050
    C 470 2100, 430 2150, 460 2200
    C 480 2250, 440 2300, 450 2350
    C 460 2380, 420 2400, 450 2450
    C 470 2500, 430 2550, 460 2600
    C 480 2650, 440 2700, 450 2750
    C 460 2780, 420 2800, 450 2850
    C 470 2900, 430 2950, 460 3000
    C 480 3050, 440 3100, 450 3150
    C 460 3200, 420 3250, 450 3300
    C 470 3350, 430 3400, 460 3450
`;

const Features = () => {
    const pathRef = useRef<SVGPathElement | null>(null);
    const sectionRef = useRef<HTMLDivElement | null>(null);
    const [svgHeight, setSvgHeight] = useState<number | null>(null);
    const [pathLength, setPathLength] = useState(0);
    const [mounted,setMounted] = useState(false);
    const [arrowPos, setArrowPos] = useState<{ x: number; y: number; angle: number } | null>(null);
    const [arrowVisible, setArrowVisible] = useState(true);

    useEffect(()=>{
        setMounted(true);
    },[])

    useEffect(() => {
        const updateSvgHeight = () => setSvgHeight(window.innerHeight * 2.75);
        updateSvgHeight();
        window.addEventListener("resize", updateSvgHeight);
        return () => window.removeEventListener("resize", updateSvgHeight);
    }, []);

    useEffect(() => {
        if (!pathRef.current || !sectionRef.current || svgHeight === null) return;

        const length = pathRef.current.getTotalLength();
        setPathLength(length);

        pathRef.current.style.strokeDasharray = `${length}`;
        pathRef.current.style.strokeDashoffset = `${length}`;

        sectionRef.current.style.height = "275vh";

        const onScroll = () => {
            const scrollY = window.scrollY;
            const viewportHeight = window.innerHeight;
            const sectionTop = sectionRef.current!.offsetTop;
            const sectionHeight = sectionRef.current!.offsetHeight;

            let progress = (scrollY + viewportHeight - sectionTop) / sectionHeight;

            const startOffset = 0.1;
            if (progress < startOffset) progress = 0;
            else progress = (progress - startOffset) / (1 - startOffset);

            progress = Math.min(Math.max(progress, 0), 1);

            const minProgress = 0.01; // never 0
            const clampedProgress = Math.max(progress, minProgress);
            const drawLength = length * clampedProgress;
            pathRef.current!.style.strokeDashoffset = `${length - drawLength}`;

            // Arrowhead logic
            if (pathRef.current) {
                const currentLength = drawLength;
                const point = pathRef.current.getPointAtLength(currentLength);
                const delta = 1;
                const prev = pathRef.current.getPointAtLength(Math.max(0, currentLength - delta));
                const angle = Math.atan2(point.y - prev.y, point.x - prev.x) * (180 / Math.PI);
                setArrowPos({ x: point.x, y: point.y, angle });
                // Hide arrow at start or end
                if (progress <= minProgress || progress >= 1) {
                    setArrowVisible(false);
                } else {
                    setArrowVisible(true);
                }
            }
        };

        window.addEventListener("scroll", onScroll);
        window.addEventListener("resize", onScroll);
        onScroll();

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, [svgHeight]);

    useEffect(() => {

        if(!mounted) return;

        const observerOptions = {
            threshold: 0.5,
        };

        const fadeElements = document.querySelectorAll('.features-fade');
        const dots = document.querySelectorAll('.dot-fade');

        const observer = new window.IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                console.log('[Features] Observed entry:', entry.target, 'isIntersecting:', entry.isIntersecting, 'intersectionRatio:', entry.intersectionRatio);
                if (entry.isIntersecting) {
                    entry.target.classList.add('show');
                } else {
                    entry.target.classList.remove('show');
                }
            });
        }, observerOptions);

        fadeElements.forEach((el) => observer.observe(el));
        dots.forEach((dot) => observer.observe(dot));

        return () => {
            fadeElements.forEach((el) => observer.unobserve(el));
            dots.forEach((el) => observer.unobserve(el));
        };
    }, [mounted]);

    if (svgHeight === null) return null;

    return (
            <section
                ref={sectionRef}
                className={"bg-gray-100 relative flex justify-center items-start " + cabin.className}
                style={{ height: "275vh" }}
            >
                <svg
                    width={900}
                    height={svgHeight}
                    className="absolute top-0 left-1/2 -translate-x-1/2 pointer-events-none"
                    viewBox="0 0 900 3450"
                    preserveAspectRatio="xMidYMin meet"
                >
                    <path
                    ref={pathRef}
                    d={PATH_D}
                    stroke="black"
                    strokeWidth={8}
                    fill="none"
                    strokeLinecap="round"
                    style={{ transition: "stroke-dashoffset 0.15s ease-out" }}
                    />
                    {arrowPos && arrowVisible && (
                        <g
                            transform={`translate(${arrowPos.x},${arrowPos.y + 8}) rotate(${arrowPos.angle})`}
                            style={{ pointerEvents: "none" }}
                        >
                            <polygon
                                points="0,0 -48,22 -34,0 -48,-22"
                                fill="#298dd4"
                                stroke="black"
                                strokeWidth={4}
                            />
                        </g>
                    )}
                </svg>

                <div>
                    <div className={"w-7 h-7 bg-black rounded-full absolute top-[150px] left-1/2 -translate-x-1/2 border-4 border-[#298dd4] dot-fade"} />
                    <div className={"absolute left-10 top-20 p-3 max-w-xl flex flex-col items-start justify-center gap-5 features-fade"}>
                        <h1 className="text-4xl font-extrabold features-h1-left">Connect</h1>
                        <p className="font-medium">
                            Start matching with people most close to you using your intrests and target person.
                            From anywhere around the world.
                        </p>
                    </div>
                </div>
                <div>
                    <div className={"w-7 h-7 bg-black rounded-full absolute top-[495px] left-[calc(50%+5px)] -translate-x-1/2 border-4 border-[#298dd4] dot-fade"} />
                    <div className={"absolute top-[450px] right-10 p-3 max-w-xl flex flex-col items-end justify-center gap-5 features-fade"}>
                        <h1 className="text-4xl font-extrabold features-h1-right">Connect</h1>
                        <p className="font-medium">
                            Start matching with people most close to you using your intrests and target person.
                            From anywhere around the world.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="w-7 h-7 bg-black rounded-full absolute top-[900px] left-[calc(50%+3px)] -translate-x-1/2 border-4 border-[#298dd4] dot-fade" />
                    <div className="absolute top-[850px] left-10 p-3 max-w-xl flex flex-col items-start justify-center gap-5 features-fade">
                        <h1 className="text-4xl font-extrabold features-h1-left">Create your Startup</h1>
                        <p className="font-medium">
                            Start matching with people most close to you using your intrests and target person.
                            From anywhere around the world.
                        </p>
                    </div>
                </div>
                <div>
                    <div className="w-7 h-7 bg-black rounded-full absolute top-[1300px] left-[calc(50%+0px)] -translate-x-1/2 border-4 border-[#298dd4] dot-fade" />
                    <div className="absolute top-[1250px] right-10 p-3 max-w-xl flex flex-col items-end justify-center gap-5 features-fade">
                        <h1 className="text-4xl font-extrabold features-h1-right">Build and Tweak your Ideas</h1>
                        <p className="font-medium">
                            Start matching with people most close to you using your intrests and target person.
                            From anywhere around the world.
                        </p>
                    </div>
                </div>
            </section>
        );
    };

export default Features;