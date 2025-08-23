import { useState } from 'react';
import type { FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { Button } from '@components/Button';
import { BaseModal } from '@components/BaseModal';
import { Input } from '@components/Input';
import { Typography } from '@components/Typography';
import { Icon } from '@components/Icon';
import { createUser } from '../api';
import type { CreateUserRequest } from '@shared/api/data.models';

type CreateUserButtonProps = {
  onComplete: () => Promise<void>;
  disabled?: boolean;
};

export const CreateUserButton: FC<CreateUserButtonProps> = ({ onComplete, disabled }) => {
  const { t } = useTranslation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setError,
    formState: { errors, isValid },
  } = useForm<CreateUserRequest>({
    defaultValues: {
      full_name: '',
      email: '',
      phone: '',
    },
    mode: 'onChange',
  });

  const openModal = () => !disabled && setIsModalOpen(true);

  const closeModal = () => {
    if (!isCreating) {
      reset();
      setIsModalOpen(false);
    }
  };

  const handleCreate = async (data: CreateUserRequest) => {
    if (isCreating) return;
    setIsCreating(true);
    try {
      const response = await createUser(data);

      // Check if the response is successful (backend returns error: false for success)
      if (!response.error && response.code >= 200 && response.code < 300) {
        await onComplete();
        reset();
        setIsModalOpen(false);
      } else {
        // Handle error case
        setError('email', { message: response.message || t('userAlreadyExists') }, { shouldFocus: true });
      }
    } catch (error) {
      console.error('Failed to create user:', error);
      setError('email', { message: t('userAlreadyExists') }, { shouldFocus: true });
    } finally {
      setIsCreating(false);
    }
  };

  const email = watch('email');

  const isFormEmptyOrInvalid =
    !email?.trim() ||
    !isValid;

  return (
    <>
      <Button
        intent='primary'
        onClick={openModal}
        className={`h-10 px-4 text-[13px] capitalize ${disabled && 'cursor-not-allowed bg-[#EBECF0] text-[#C3C6CC]'}`}
        aria-disabled={disabled ? 'true' : 'false'}
        tabIndex={!disabled ? 0 : -1}
      >
        <Typography text={t('createUser')} weight='bold' className='text-inherit' />
        <Icon id='newUser' className='mb-[2px] ml-[5px] size-[15px]' aria-hidden='true' />
      </Button>

      <BaseModal
        isOpen={isModalOpen}
        onCloseHandler={closeModal}
        header={<Typography text={t('createUser')} weight='bold' className='text-[22px]' />}
        closeDisabled={isCreating}
        className='w-[384px]'
      >
        <form onSubmit={handleSubmit(handleCreate)} className='flex flex-col gap-4 px-6 py-4'>
          <div>
            <label htmlFor='email' className='text-[13px] text-secondary'>
              {t('email')}
            </label>
            <Input
              {...register('email', {
                required: t('emailRequired'),
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: t('invalidEmail'),
                },
              })}
              errorMsg={errors.email?.message}
              id='email'
              name='email'
              type='email'
              disabled={isCreating}
              className='h-12 w-full rounded-xl text-[15px] focus:ring-[3px]'
              placeholder={t('phEmail')}
            />
          </div>

          <div>
            <label htmlFor='full_name' className='text-[13px] text-secondary'>
              {t('fullName')}
            </label>
            <Input
              {...register('full_name', {
                required: t('fullNameRequired'),
              })}
              errorMsg={errors.full_name?.message}
              id='full_name'
              name='full_name'
              type='text'
              disabled={isCreating}
              className='h-12 w-full rounded-xl text-[15px] focus:ring-[3px]'
              placeholder={t('phFullName')}
            />
          </div>

          <div>
            <label htmlFor='phone' className='text-[13px] text-secondary'>
              {t('phone')}
            </label>
            <Input
              {...register('phone')}
              errorMsg={errors.phone?.message}
              id='phone'
              name='phone'
              type='tel'
              disabled={isCreating}
              className='h-12 w-full rounded-xl text-[15px] focus:ring-[3px]'
              placeholder={t('phPhone')}
            />
          </div>

          <div className='flex justify-between border-t pt-4'>
            <Button
              type='button'
              intent='secondary'
              text={t('cancel')}
              onClick={closeModal}
              className='h-12 w-[160px] justify-center text-[15px]'
              disabled={isCreating}
            />
            <Button
              type='submit'
              intent='primary'
              disabled={isFormEmptyOrInvalid || isCreating}
              className='h-12 w-[160px] justify-center text-[15px]'
            >
              {isCreating ? <Icon id='button-loading' className='size-6 animate-spin' /> : t('create')}
            </Button>
          </div>
        </form>
      </BaseModal>
    </>
  );
};
