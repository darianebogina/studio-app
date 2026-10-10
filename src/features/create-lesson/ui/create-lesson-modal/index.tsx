'use client';

import { Modal } from '@/shared/ui-kit';
import { CreateLessonForm } from './create-lesson-form';

type CreateLessonModalProps = {
    isOpen: boolean;
    onClose: () => void;
    defaultDate?: Date;
};

// Modal монтирует контент только в открытом состоянии, поэтому форма сбрасывается при каждом открытии
// и подхватывает актуальную defaultDate
export const CreateLessonModal = ({ isOpen, onClose, defaultDate }: CreateLessonModalProps) => (
    <Modal
        isOpen={isOpen}
        title="Новое занятие"
        onClose={onClose}
    >
        <CreateLessonForm defaultDate={defaultDate} onCreated={onClose} />
    </Modal>
);
