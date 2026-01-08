import { Image, useMantineColorScheme } from '@mantine/core';
import bg_light from "../../../assets/images/banner_light.png";
import bg_dark from "../../../assets/images/banner_dark.png";



export const Logo = ({ height = 200, width = "auto" }) => {
    const { colorScheme } = useMantineColorScheme();
    return (
        <Image
            radius="md"
            mx="auto"
            h={height}
            w={width}
            fit="contain"
            alt="logo"
            src={colorScheme === "dark" ? bg_dark : bg_light}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
    );
};
