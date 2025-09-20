import { Container, Divider } from "@mantine/core";
import { TitlePage } from "../../components";

const PerfilPage = () => {
    return (
        <Container size="lg" my={20}>
            <TitlePage order={2}>Mi Perfil</TitlePage>
            <Divider my={10} />
        </Container>
    );
};

export default PerfilPage;
