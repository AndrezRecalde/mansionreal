import { Group, Skeleton } from "@mantine/core";
import { SKELETON_CONFIG } from "../../../helpers/calendario.constants.js";

/**
 * Componente para mostrar el skeleton de carga
 */
export const LoadingSkeleton = () => (
    <Group gap={20}>
        {Array.from({ length: SKELETON_CONFIG.COUNT }, (_, i) => (
            <Skeleton
                key={i}
                height={SKELETON_CONFIG.HEIGHT}
                mt={SKELETON_CONFIG.MARGIN_TOP}
                width={SKELETON_CONFIG.WIDTH}
                radius={SKELETON_CONFIG.RADIUS}
            />
        ))}
    </Group>
);
