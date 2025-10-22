import { Divider, Paper, Text } from "@mantine/core";
import { useTitleHook } from "../../hooks";
import { AuthForm, TitlePage } from "../../components";
import classes from "./modules/AuthPageBackground.module.css";

const AuthPage = () => {
    useTitleHook("Acceder - Mansión Real");
    return (
        <div className={classes.wrapper}>
            <Paper radius="md" shadow="md" className={classes.card}>
                {/* Columna izquierda: formulario */}
                <div className={classes.left}>
                    <TitlePage order={2} mb="md">
                        Mansión Real
                    </TitlePage>
                    <Divider mb="xl" />
                    <AuthForm />
                </div>

                {/* Columna derecha: mensaje */}
                <div className={classes.right}>
                    <TitlePage order={2} mb="sm" c="dark.5">
                        Bienvenido!
                    </TitlePage>
                    <Text size="sm" c="dark.4">
                        Cada amanecer, un recuerdo<br />
                    </Text>
                </div>
            </Paper>
        </div>
    );
};

export default AuthPage;
