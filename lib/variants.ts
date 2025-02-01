export const thumbnailVariants = {
    closed: {
        height: "20%",
        width: "20%"
    },
    open: {
        height: "100%",
        width: "100%",
        transition: {
            duration: 0.6,
            ease: "easeInOut",
            delay: 0.3
        },
    }
};

export const opacityVariants = {
    closed: {
        opacity : 0,
        y : 100
    },
    open: {
        opacity : 1,
        y : 0,
        transition: {
            duration: 0.6,
            ease: "easeInOut",
            delay: 0.3,
            property: "opacity"
        }
    }
};

