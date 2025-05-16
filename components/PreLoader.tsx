'use client';
import Lottie from 'lottie-react';
import loader from "@/public/preloader.json";

const PreLoader = () => {
    return (
        <div className="flex justify-center items-center mx-auto w-full h-screen">
            <div className='md:w-[800px] md:h-[800px]'>
                <Lottie animationData={loader} loop={true} />
            </div>
        </div>
    );
};

export default PreLoader;