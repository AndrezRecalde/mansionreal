import cx from "clsx";
import {
    Container,
    DEFAULT_THEME,
    Loader,
    createTheme,
    mergeMantineTheme,
    rgba,
    darken,
} from "@mantine/core";
import { CssLoader } from "./components";
import classes from "./assets/styles/Container.module.css";

export const themeOrverride = createTheme({
    fontFamily: "Poppins, Greycliff CF, sans-serif",
    headings: { fontFamily: "Poppins, Greycliff CF, sans-serif" },
    primaryColor: "teal",
    components: {
        Container: Container.extend({
            classNames: (_, { size }) => ({
                root: cx({
                    [classes.responsiveContainer]: size === "responsive",
                }),
            }),
        }),
        Loader: Loader.extend({
            defaultProps: {
                loaders: { ...Loader.defaultLoaders, custom: CssLoader },
                type: "custom",
            },
        }),
        Badge: {
            variants: {
                light: (theme, props) => {
                    // Determina el color base desde el theme o el prop
                    const colorName = props.color || theme.primaryColor;
                    const parsedColorValue =
                        theme.colors[colorName]?.[6] || colorName;

                    return {
                        root: {
                            background: rgba(parsedColorValue, 0.1),
                            border: `1px solid ${parsedColorValue}`,
                            color: darken(parsedColorValue, 0.1),
                            "&:hover": {
                                background: rgba(parsedColorValue, 0.15),
                            },
                        },
                    };
                },
            },
        },
    },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOrverride);
