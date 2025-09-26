import { Divider, Paper, Text, Title } from "@mantine/core";
import { useTitleHook } from "../../hooks";
import { AuthForm } from "../../components";
import classes from "./modules/AuthPageBackground.module.css";

const AuthPage = () => {
    useTitleHook("Acceder - Mansión Real");
    return (
        <div className={classes.wrapper}>
            <Paper radius="md" shadow="md" className={classes.card}>
                {/* Columna izquierda: formulario */}
                <div className={classes.left}>
                    <Title order={2} mb="md">
                        Mansión Real
                    </Title>
                    <Divider mb="xl" />
                    <AuthForm />
                </div>

                {/* Columna derecha: mensaje */}
                <div className={classes.right}>
                    <Title order={2} mb="sm">
                        Bienvenido!
                    </Title>
                    <Text size="sm" c="gray.4">
                        Un atardecer inolvidable
                        v7. <br />
                    </Text>
                </div>
            </Paper>
        </div>
    );
};

export default AuthPage;
