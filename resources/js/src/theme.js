import cx from "clsx";
import {
    Container,
    DEFAULT_THEME,
    Loader,
    createTheme,
    mergeMantineTheme,
    rgba,
    darken,
    parseThemeColor,
} from "@mantine/core";
import { CssLoader } from "./components";
import classes from "./assets/styles/Container.module.css";

export const themeOrverride = createTheme({
    fontFamily: "Poppins, Greycliff CF, sans-serif",
    headings: { fontFamily: "Poppins, Greycliff CF, sans-serif" },

    colors: {
        "corporate-blue": [
            "#e6f0ff", // 0: muy claro - cielo suave
            "#b3d1ff", // 1: claro
            "#80b3ff", // 2: claro medio
            "#4d94ff", // 3: medio
            "#1a75ff", // 4: medio vibrante - ideal para dark mode
            "#0056e0", // 5: azul brillante
            "#0047AB", // 6: azul corporativo premium base (Cobalt)
            "#003d94", // 7: oscuro
            "#00337d", // 8: muy oscuro
            "#002966", // 9: ultra oscuro
        ],
    },

    primaryColor: "corporate-blue",

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

    },
});

export const theme = mergeMantineTheme(DEFAULT_THEME, themeOrverride);
