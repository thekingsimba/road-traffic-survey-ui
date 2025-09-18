import { useEffect, useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@components/Button';
import { BaseModal } from '@components/BaseModal';
import { Input } from '@components/Input';
import { Typography } from '@components/Typography';
import { Icon } from '@components/Icon';
import { updateUser } from '../api';
import { useUserStore } from '@shared/stores/userStore';
import type { User, UpdateUserRequest } from '@shared/api/data.models';

type EditUserModalProps = {
  user: User;
  isOpen: boolean;
  onClose: () => void;
  onComplete: () => Promise<void>;
};

export const EditUserModal: FC<EditUserModalProps> = ({ user, isOpen, onClose, onComplete }) => {
  const { t } = useTranslation();
  const [isSaving, setIsSaving] = useState(false);
  const userStore = useUserStore(state => state.user);
  const updateUserData = useUserStore(state => state.updateUserData);


  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid, isDirty },
  } = useForm<UpdateUserRequest>({
    defaultValues: {
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      picture: user.picture,
    },
    mode: 'onChange',
  });

  useEffect(() => {
    reset({
      id: user.id,
      full_name: user.full_name,
      phone: user.phone,
      picture: user.picture,
    });
  }, [user, reset]);

  const isFormInvalid =
    !isValid ||
    !isDirty ||
    !user.email?.trim();

  const handleUpdate = async (data: UpdateUserRequest) => {
    if (isSaving || !user.id) return;
    setIsSaving(true);
    try {
      await updateUser(user.id, data);
      await onComplete();

      if (user.id === userStore?.id) {
        await updateUserData({
          full_name: data.full_name,
        });
      }

      onClose();
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <BaseModal
      isOpen={isOpen}
      onCloseHandler={onClose}
      header={<Typography text={t('editUser')} weight='bold' className='text-[22px]' />}
      closeDisabled={isSaving}
      className='w-[384px]'
    >
      <form onSubmit={handleSubmit(handleUpdate)} className='flex flex-col gap-4 px-6 py-4'>
        <label htmlFor='email' className='text-[13px] text-secondary'>
          {t('email')}
        </label>
        <Input
          id='email'
          name='email'
          type='email'
          value={user.email}
          disabled
          className='h-12 w-full rounded-xl text-[15px]'
          placeholder={t('email')}
        />

        <label htmlFor='full_name' className='text-[13px] text-secondary'>
          {t('fullName')}
        </label>
        <Input
          {...register('full_name')}
          errorMsg={errors.full_name?.message}
          id='full_name'
          name='full_name'
          type='text'
          disabled={isSaving}
          className='h-12 w-full rounded-xl text-[15px]'
          placeholder={t('fullName')}
        />

        <label htmlFor='phone' className='text-[13px] text-secondary'>
          {t('phone')}
        </label>
        <Input
          {...register('phone')}
          errorMsg={errors.phone?.message}
          id='phone'
          name='phone'
          type='tel'
          disabled={isSaving}
          className='h-12 w-full rounded-xl text-[15px]'
          placeholder={t('phone')}
        />

        <div className='flex items-center gap-2'>
          <label htmlFor='countingPost' className='text-[14px] text-secondary'>
            {t('countingPost')}
          </label>
          <select
            id='countingPost'
            {...register('countingPost')}
            disabled={isSaving}
            className='h-12 w-full rounded-xl border border-gray-300 px-3 text-[15px]'
          >
            <option value=''>{t('selectCountingPost')}</option>
            <option value='start'>{t('start')}</option>
            <option value='end'>{t('end')}</option>
          </select>
        </div>

        <div className='flex justify-between border-t pt-4'>
          <Button
            type='button'
            intent='secondary'
            text={t('cancel')}
            onClick={onClose}
            className='h-12 w-[160px] justify-center text-[15px]'
            disabled={isSaving}
          />
          <Button
            type='submit'
            intent='primary'
            disabled={isFormInvalid || isSaving}
            className='h-12 w-[160px] justify-center text-[15px]'
          >
            {isSaving ? <Icon id='button-loading' className='size-6 animate-spin' /> : t('save')}
          </Button>
        </div>
      </form>
    </BaseModal>
  );
};
