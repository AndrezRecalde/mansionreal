import { Container, Divider } from "@mantine/core";
import { ContrasenaForm, TextSection, TitlePage } from "../../components";

const CambioContrasenaPage = () => {
    return (
        <Container size={560} my={30}>
            <TitlePage order={2} ta="center">
                Cambiar Contraseña
            </TitlePage>
            <TextSection color="dimmed" tt="" fz={16} ta="center">
                Ingresa tu nueva contraseña y verificala.
            </TextSection>
            <Divider my={20} />
            <ContrasenaForm />
        </Container>
    );
};

export default CambioContrasenaPage;
