"use server";


export const getRandomAd = async ()=> {
    try {
        const ads = [
            {
              id: '679663a41fdafb874e6c41e1',
              name: 'END AUDIO ADS',
              color: '#47102d',
              image: 'https://res.cloudinary.com/dkaj1swfy/image/upload/v1737909106/fhwq7vjkse3hrtvngvgz.avif',     
              url: 'https://ik.imagekit.io/oqmbdmj4a/41948033-abb8-49e3-8c08-ae54ff5f96b9/playlist.m3u8',
              duration: 16,
              createdAt: new Date(),
              updatedAt: new Date()
            },
            {
              id: '67978c6956d13b0ed3fb5491',
              name: 'Elevate Your Tunes',
              color: '#0f6287',
              image: 'https://res.cloudinary.com/dkaj1swfy/image/upload/v1737985035/womyswmmmktuf1jpip6e.png',      
              url: 'https://ik.imagekit.io/oqmbdmj4a/ae727656-c49a-41c1-a587-5171f2a627e3/playlist.m3u8',
              duration: 43,
              createdAt: new Date(),
              updatedAt: new Date()
            }
        ];

        const randomAd = ads[Math.floor(Math.random() * ads.length)];
        return randomAd;
        
    } catch (error) {
        console.log("RANDOM AD API ERROR");
        return null;
    }
}

