'use client';

import { Modal } from '@/shared/ui-kit';
import { StudentPicker } from './student-picker';

type AddStudentModalProps = {
    isOpen: boolean;
    lessonId: string;
    onClose: () => void;
    onAdded?: () => void;
};

// Modal монтирует контент только в открытом состоянии, поэтому поиск и список сбрасываются при каждом открытии.
// Поверх модалки занятия встаёт сама: оба <dialog> открыты через showModal() и лежат в top layer
// в порядке открытия, z-index не нужен
export const AddStudentModal = ({ isOpen, lessonId, onClose, onAdded }: AddStudentModalProps) => (
    <Modal
        isOpen={isOpen}
        title="Добавить ученика"
        onClose={onClose}
    >
        <StudentPicker lessonId={lessonId} onAdded={onAdded} />
    </Modal>
);
