import { Divider, Paper, Text } from "@mantine/core";
import { useTitleHook } from "../../hooks";
import { AuthForm, TitlePage } from "../../components";
import {
    BIENVENIDA,
    BIENVENIDA_MENSAJE,
    NOMBRE_SISTEMA,
    PAGE_TITLE,
} from "../../helpers/getPrefix";
import classes from "./modules/AuthPageBackground.module.css";

const AuthPage = () => {
    useTitleHook(PAGE_TITLE.AUTENTICACION);
    return (
        <div className={classes.wrapper}>
            <Paper radius="md" shadow="md" className={classes.card}>
                {/* Columna izquierda: formulario */}
                <div className={classes.left}>
                    <TitlePage ta="center" order={1} mb="md" style={{ letterSpacing: "1px" }}>
                        {NOMBRE_SISTEMA}
                    </TitlePage>
                    <Divider mb="xl" />
                    <AuthForm />
                </div>

                {/* Columna derecha: mensaje */}
                <div className={classes.right}>
                    <TitlePage order={2} mb="sm" c="dark.5" style={{ letterSpacing: "1px" }}>
                        {BIENVENIDA}
                    </TitlePage>
                    <Text size="sm" c="dark.4" style={{ letterSpacing: "0.5px" }}>
                        {BIENVENIDA_MENSAJE}
                        <br />
                    </Text>
                </div>
            </Paper>
        </div>
    );
};

export default AuthPage;
