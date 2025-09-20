import "./assets/styles/index.css";
import "@mantine/core/styles.css";
import "@mantine/dates/styles.css";
import '@mantine/carousel/styles.css';
import "mantine-react-table/styles.css";
import { MantineProvider } from "@mantine/core";
import { DatesProvider } from "@mantine/dates";
import { Provider } from "react-redux";
import { theme } from "./theme";
import { store } from "./store/store";
import { Suspense } from "react";
import { BrowserRouter } from "react-router-dom";
import { AppRouter } from "./routes/AppRouter";

export const App = () => {
    return (
        <MantineProvider theme={theme} defaultColorScheme="light">
            <DatesProvider settings={{ locale: "es" }}>
                <Provider store={store}>
                    <Suspense fallback={<span>Cargando...</span>}>
                        <BrowserRouter>
                            <AppRouter />
                        </BrowserRouter>
                    </Suspense>
                </Provider>
            </DatesProvider>
        </MantineProvider>
    );
};
