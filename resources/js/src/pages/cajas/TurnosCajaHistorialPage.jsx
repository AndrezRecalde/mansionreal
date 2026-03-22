import { useEffect, useState } from "react";
import { Container, Grid, Paper } from "@mantine/core";
import { useCajasStore } from "../../hooks";
import { TurnosCajaTable } from "../../components/cajas/table/TurnosCajaTable";
import { PrincipalSectionPage, TitlePage } from "../../components";
import { DatePickerInput } from "@mantine/dates";
import { IconCalendar } from "@tabler/icons-react";
import dayjs from "dayjs";

const TurnosCajaHistorialPage = () => {
    const { turnosHistorial, fnCargarHistorial, cargando } = useCajasStore();

    const [dateRange, setDateRange] = useState([
        dayjs().startOf("month").toDate(),
        dayjs().endOf("month").toDate(),
    ]);

    useEffect(() => {
        if (dateRange[0] && dateRange[1]) {
            fnCargarHistorial({
                fecha_inicio: dayjs(dateRange[0]).format("YYYY-MM-DD"),
                fecha_fin: dayjs(dateRange[1]).format("YYYY-MM-DD"),
            });
        }
    }, [dateRange]);

    return (
        <Container fluid>
            <PrincipalSectionPage
                title="Historial de Cierres de Caja"
                description="Aquí puedes ver el historial de cierres de caja."
                icon={<IconCalendar size={24} />}
            />

            <Paper shadow="sm" p="md" radius="md" withBorder mb="md">
                <Grid align="flex-end">
                    <Grid.Col span={{ base: 12, sm: 6, md: 4 }}>
                        <DatePickerInput
                            type="range"
                            label="Rango de Fechas"
                            placeholder="Seleccione inicio y fin"
                            value={dateRange}
                            onChange={setDateRange}
                            leftSection={<IconCalendar size={16} />}
                            maxDate={new Date()}
                            clearable
                        />
                    </Grid.Col>
                </Grid>
            </Paper>

            <Paper shadow="sm" radius="md" withBorder>
                <TurnosCajaTable data={turnosHistorial} isLoading={cargando} />
            </Paper>
        </Container>
    );
};

export default TurnosCajaHistorialPage;
