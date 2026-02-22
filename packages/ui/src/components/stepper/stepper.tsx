import { Check, type LucideIcon } from 'lucide-react';
import { useCallback, useEffect, useRef } from 'react';

import {
    connectorVariants,
    connectorWrapperVariants,
    indicatorVariants,
    labelVariants,
    stepContainerVariants,
    stepVariants
} from './stepper.styles';

export type Step = {
    id: string;
    label: string;
    icon: LucideIcon;
};

export type StepperProps = {
    steps: Step[];
    currentStep: number;
    labelPosition?: 'top' | 'bottom' | 'left' | 'right';
};

type StepStatus = 'completed' | 'active' | 'pending';

export function Stepper({ steps, currentStep, labelPosition = 'bottom' }: StepperProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const stepsRefs = useRef<Map<number, HTMLDivElement>>(new Map());

    // Função para calcular o status de um step
    const getStepStatus = useCallback(
        (stepNumber: number): StepStatus => {
            if (stepNumber < currentStep) return 'completed';
            if (stepNumber === currentStep) return 'active';
            return 'pending';
        },
        [currentStep]
    );

    // Função para registrar ref de um step
    const setStepRef = useCallback((stepNumber: number) => {
        return (el: HTMLDivElement | null) => {
            if (el) {
                stepsRefs.current.set(stepNumber, el);
            } else {
                stepsRefs.current.delete(stepNumber);
            }
        };
    }, []);

    // Scroll automático para o step ativo
    const scrollToActiveStep = useCallback(() => {
        const container = containerRef.current;
        const activeStep = stepsRefs.current.get(currentStep);

        if (!activeStep || !container) return;

        const stepLeft = activeStep.offsetLeft;
        const stepWidth = activeStep.offsetWidth;
        const containerWidth = container.offsetWidth;
        const scrollPosition = stepLeft - containerWidth / 2 + stepWidth / 2;

        container.scrollTo({
            left: scrollPosition,
            behavior: 'smooth'
        });
    }, [currentStep]);

    useEffect(() => {
        scrollToActiveStep();
    }, [scrollToActiveStep]);

    return (
        <div
            ref={containerRef}
            className="w-full overflow-x-auto [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
        >
            <div className="flex w-full min-w-max items-start">
                {steps.map((step, index) => {
                    const stepNumber = index + 1;
                    const stepStatus = getStepStatus(stepNumber);
                    const isLastStep = index === steps.length - 1;
                    const Icon = step.icon;

                    // Status da linha: azul se o step atual está completo
                    const connectorStatus: StepStatus = stepStatus === 'completed' ? 'completed' : 'pending';

                    return (
                        <div key={step.id} ref={setStepRef(stepNumber)} className={stepContainerVariants({ labelPosition })}>
                            {/* Step: Indicador + Label */}
                            <div className={stepVariants({ labelPosition })}>
                                {/* Indicador do step */}
                                <div className={indicatorVariants({ status: stepStatus })}>
                                    {stepStatus === 'completed' ? (
                                        <Check className="size-4 md:size-5" aria-label="Completed" />
                                    ) : (
                                        <Icon className="size-4 md:size-5" />
                                    )}
                                </div>

                                {/* Label do step */}
                                <div className="w-full text-center">
                                    <p className={labelVariants({ status: stepStatus })}>{step.label}</p>
                                </div>
                            </div>

                            {/* Linha conectora entre steps */}
                            {!isLastStep && (
                                <div className={connectorWrapperVariants({ labelPosition })}>
                                    <div className={connectorVariants({ status: connectorStatus })} />
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
