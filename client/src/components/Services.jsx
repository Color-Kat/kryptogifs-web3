import { BsShieldFillCheck } from "react-icons/bs";
import { BiSearchAlt } from "react-icons/bi";
import { RiHeart2Fill } from "react-icons/ri";

const ServiceCard = ({color, title, icon, subtitle}) => {
    return (
        <div className="w-full flex flex-row justify-start items-center white-glassmorphism p-3 pl-5 m-2 cursor-pointer hover:shadow-xl">
            <div className={`w-10 h-10 rounded-full flex justify-center items-center ${color}`}>
                {icon}
            </div>

            <div className="ml-5 flex flex-col flex-1">
                <h3 className="mt-2 text-white text-lg">{title}</h3>
                <p className="mt-2 text-white text-sm md:w-9/12">{subtitle}</p>
            </div>
        </div>
    );
}

const Services = () => {
    return (
        <div className="flex flex-col mf:flex-row w-full justify-center items-center gradient-bg-services">
            <div className="flex mf:flex-row flex-col items-center justify-between md:p-20 py-12 px-4">
                <div className="flex-1 flex flex-col justify-start items-start">
                    <h1 className="text-white text-3xl sm:text-5xl py-2 text-gradient">
                        Services that we
                        <br />
                        continue to improve
                    </h1>
                </div>
            </div>

            <div className="flex-1 flex flex-col justify-start items-center px-3">
                <ServiceCard
                    color="bg-[#2952e3]"
                    title="Security Guaranteed"
                    icon={<BsShieldFillCheck fontSize={21} color="white" />}
                    subtitle="Security is guarated. We always maintain privacy and mainring the quality of our products."
                />

                <ServiceCard
                    color="bg-[#8945f8]"
                    title="Best exchange rates"
                    icon={<BiSearchAlt fontSize={21} color="white" />}
                    subtitle="Because we use the metamask extention, we have best exchange rates"
                />

                <ServiceCard
                    color="bg-[#f84550]"
                    title="Fastest transactions"
                    icon={<RiHeart2Fill fontSize={21} color="white" />}
                    subtitle="We have the optimal amount of gas for transactions"
                />
            </div>
        </div>
    );
};

export default Services;