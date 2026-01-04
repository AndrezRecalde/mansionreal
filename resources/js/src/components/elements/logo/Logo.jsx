import { Image } from '@mantine/core';
import bg from "../../../assets/images/banner.png";


export const Logo = ({ height = 200, width = "auto" }) => {
    return (
        <Image
            radius="md"
            mx="auto"
            h={height}
            w={width}
            fit="contain"
            alt="logo"
            src={bg}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
    );
};
