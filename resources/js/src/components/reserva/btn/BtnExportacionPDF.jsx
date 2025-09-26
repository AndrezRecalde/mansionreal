import { IconPackageExport } from "@tabler/icons-react";
import { BtnSection } from "../../../components";

export const BtnExportacionPDF = ({ handleActionExport }) => {
    return (
        <BtnSection
            fullWidth
            fontSize={12}
            mb={10}
            mt={10}
            IconSection={IconPackageExport}
            variant="default"
            handleAction={handleActionExport}
        >
            Exportar PDF Todas las Reservas
        </BtnSection>
    );
};
