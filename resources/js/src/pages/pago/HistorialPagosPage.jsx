import {
    Box,
    Container,
    Divider,
    Fieldset,
    SimpleGrid,
    TextInput,
} from "@mantine/core";
import { BtnSubmit, PagosHistorialTable, TitlePage } from "../../components";
import { DateInput } from "@mantine/dates";
import { useForm } from "@mantine/form";
import { IconSearch } from "@tabler/icons-react";
import dayjs from "dayjs";
import classes from "../../components/elements/modules/LabelsInput.module.css";
import { usePagoStore } from "../../hooks";

const HistorialPagosPage = () => {
    const { cargando, fnCargarHistorialPagos } = usePagoStore();

    const form = useForm({
        initialValues: {
            codigo_voucher: "",
            fecha_inicio: "",
            fecha_fin: "",
        },
        validate: (values) => {
            const errors = {};
            const tieneCodigo = values.codigo_voucher.trim() !== "";
            const tieneFechas =
                values.fecha_inicio !== "" && values.fecha_fin !== "";
            if (!tieneCodigo && !tieneFechas) {
                errors.codigo_voucher =
                    "Debes buscar por código de voucher o por rango de fechas";
                errors.fecha_inicio =
                    "Debes buscar por código de voucher o por rango de fechas";
                errors.fecha_fin =
                    "Debes buscar por código de voucher o por rango de fechas";
            }
            return errors;
        },
        transformValues: (values) => ({
            ...values,
            fecha_inicio: dayjs(values.fecha_inicio).isValid()
                ? dayjs(values.fecha_inicio).format("YYYY-MM-DD")
                : null,
            fecha_fin: dayjs(values.fecha_fin).isValid()
                ? dayjs(values.fecha_fin).add(1, "day").format("YYYY-MM-DD")
                : null,
        }),
    });

    const { fecha_inicio } = form.values;

    const handleSubmit = (e) => {
        e.preventDefault();
        //console.log("submit");
        fnCargarHistorialPagos(form.getTransformedValues());
    };

    return (
        <Container size="xl" my={20}>
            <TitlePage order={2}>Historial de Pagos</TitlePage>
            <Divider my={10} />
            <Fieldset legend="Filtrar Búsqueda" mt={20} mb={20}>
                <Box
                    component="form"
                    onSubmit={form.onSubmit((_, e) => handleSubmit(e))}
                >
                    <TextInput
                        withAsterisk
                        label="Código Voucher"
                        placeholder="Ingrese código del voucher"
                        classNames={classes}
                        {...form.getInputProps("codigo_voucher")}
                    />
                    <SimpleGrid cols={{ base: 1, sm: 2, md: 2, lg: 2 }} mt={10}>
                        <DateInput
                            withAsterisk
                            clearable
                            valueFormat="YYYY-MM-DD"
                            label="Fecha inicio"
                            placeholder="Seleccione fecha de inicio"
                            classNames={classes}
                            {...form.getInputProps("fecha_inicio")}
                        />
                        <DateInput
                            clearable
                            minDate={new Date(fecha_inicio)}
                            withAsterisk
                            valueFormat="YYYY-MM-DD"
                            label="Fecha final"
                            placeholder="Seleccione fecha de fin"
                            classNames={classes}
                            {...form.getInputProps("fecha_fin")}
                        />
                    </SimpleGrid>
                    <BtnSubmit IconSection={IconSearch} loading={cargando}>
                        Buscar
                    </BtnSubmit>
                </Box>
            </Fieldset>
            <Divider my={10} />
            <PagosHistorialTable />
        </Container>
    );
};

export default HistorialPagosPage;
