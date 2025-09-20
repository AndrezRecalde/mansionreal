import { Image } from '@mantine/core';

export const Logo = ({ height = 200, width = "auto" }) => {
    return (
        <Image
            radius="md"
            mx="auto"
            h={height}
            w={width}
            fit="contain"
            alt="logo"
            src={'https://placehold.co/600x400?text=Placeholder'}
            fallbackSrc="https://placehold.co/600x400?text=Placeholder"
        />
    );
};
