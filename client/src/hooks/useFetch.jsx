import { useEffect, useState } from "react";

const API_KEY = import.meta.env.GIPHY_API;

const useGifFetch = (keyword) => {
    const [gifUrl, setGifUrl] = useState("");

    const fetchGifs = async () => {
        try {
            const response = await fetch(`https://api.giphy.com/v1/gifs/search?api_key=${API_KEY}&q=${keyword.split(" ").join("")}&limit=1`);

            const { gifData } = await response.json();


            console.log(gifData);
            setGifUrl(gifData[0]?.images?.downsized_medium?.url);
        } catch (error) {
            console.log(error);
            setGifUrl("https://media4.popsugar-assets.com/files/2013/11/07/832/n/1922398/eb7a69a76543358d_28.gif");
        }
    }

    useEffect(() => {
        if(keyword) fetchGifs(); 
    }, [keyword]);

    return gifUrl;
}

export default useGifFetch