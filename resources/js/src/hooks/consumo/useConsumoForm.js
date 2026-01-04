import { useForm } from "@mantine/form";
import { INITIAL_CONSUMO } from "./consumo";

export function useConsumoForm() {
    return useForm({
        initialValues: {
            reserva_id: "",
            consumos: [{ ...INITIAL_CONSUMO }],
        },
        validate: {
            consumos: {
                categoria_id: (value) =>
                    ! value ? "Seleccione una categoría" : null,
                inventario_id: (value) =>
                    !value ? "Seleccione un producto" :  null,
                cantidad: (value) => (value < 1 ? "Debe ser al menos 1" : null),
            },
        },
    });
}
