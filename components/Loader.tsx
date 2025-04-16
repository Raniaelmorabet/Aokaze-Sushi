'use client';
import Lottie from 'lottie-react';
import loaderAnimation from "@/public/loader.json";

const Loader = () => {
    return (
        <div className="flex justify-center items-center mx-auto w-full mt-40">
            <div className="w-72 h-72">
                <Lottie animationData={loaderAnimation} loop={true} />
            </div>
        </div>
    );
};

export default Loader;
