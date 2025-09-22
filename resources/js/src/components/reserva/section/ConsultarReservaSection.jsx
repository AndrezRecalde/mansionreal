import {
    Box,
    Image,
    Title,
    Paper,
    Grid,
    SimpleGrid,
    Group,
} from "@mantine/core";
import { BtnSection, ConsultaReservacionesTable } from "../../../components";
import { useReservaDepartamentoStore } from "../../../hooks";
import { IconPackageExport } from "@tabler/icons-react";

export const ConsultarReservaSection = () => {
    const { reservas } = useReservaDepartamentoStore();

    return (
        <div>
            <BtnSection
                fullWidth={true}
                fontSize={12}
                mb={10}
                mt={10}
                IconSection={IconPackageExport}
                variant="default"
                handleAction={() =>
                    console.log("Exportar PDF todas las reservas")
                }
            >
                Exportar PDF Todas las Reservas
            </BtnSection>
            <SimpleGrid cols={{ base: 1, sm: 1, md: 1, lg: 1 }} mt={10}>
                {reservas.length > 0 ? (
                    reservas.map((reserva) => (
                        <Paper withBorder radius="md" p="md" key={reserva.id}>
                            <Grid>
                                <Grid.Col span={{ base: 12, md: 4, lg: 4 }}>
                                    {/* Sección izquierda: imagen */}
                                    <Box>
                                        <Image
                                            src={`/storage/${reserva.imagen_departamento}`}
                                            alt={`departamento-${reserva.nombre_departamento}`}
                                            radius="md"
                                            fit="cover"
                                            w="100%"
                                            // Ajusta la altura mínima para que luzca bien incluso con poco contenido a la derecha
                                            h={{ base: 180, sm: 180, md: 230 }}
                                            styles={{
                                                image: {
                                                    objectPosition: "center",
                                                },
                                            }}
                                            mt={20}
                                        />
                                    </Box>
                                </Grid.Col>
                                {/* Sección derecha: Tabs */}
                                <Grid.Col span={{ base: 12, md: 8, lg: 8 }}>
                                    <Box>
                                        <ConsultaReservacionesTable
                                            reserva={reserva}
                                        />
                                    </Box>
                                </Grid.Col>
                            </Grid>
                            <Group justify="flex-end">
                                <BtnSection
                                    heigh={30}
                                    fontSize={12}
                                    mb={10}
                                    mt={10}
                                    IconSection={IconPackageExport}
                                    variant="default"
                                    // handleAction={() => fnExportarPDF(reserva.id)}
                                >
                                    Exportar PDF
                                </BtnSection>
                            </Group>
                        </Paper>
                    ))
                ) : (
                    <Title order={4} align="center" mt={20} mb={20}>
                        No hay reservas para mostrar
                    </Title>
                )}
            </SimpleGrid>
        </div>
    );
};
