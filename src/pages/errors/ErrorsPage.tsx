import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import type { ErrorModel } from './types';
import { Typography } from '@components/Typography';
import { useLocation, useParams } from 'wouter';
import { ERRORS_MESSAGES_LIST } from './constants';

export const ErrorsPage = () => {
    const { t } = useTranslation();
    const { errorCode } = useParams();
    const [, navigate] = useLocation();
  const [errorMsg, setErrorMsg] = useState<ErrorModel>();
  const [errorMsgWrapperSize, setErrorMsgWrapperSize] = useState<string>('80vw');
  const currentErrorStatusCode = errorCode as string;

  useEffect(() => { // set error msg size
    switch (currentErrorStatusCode) {
      case '401':
        setErrorMsgWrapperSize('lg:w-[627px]');
        break;

      case '403':
        setErrorMsgWrapperSize('lg:w-[707px]');
        break;

      case '404':
        setErrorMsgWrapperSize(' lg:w-[748px]');
        break;

      case '500':
      case '502':
      case '503':
      case '504':
        setErrorMsgWrapperSize('lg:w-[769px]');
        break;

      default:
        break;
    }

    return () => {

    };
  }, []);

  useEffect(() => {
        let errorMessageFound;

        switch (currentErrorStatusCode) {
            case '401':
            case '403':
            case '404':
                errorMessageFound = ERRORS_MESSAGES_LIST[currentErrorStatusCode];
                setErrorMsg(errorMessageFound);
                break;

            case '500':
            case '502':
            case '503':
            case '504':
                // all status code starting by 5.. have the same message
            errorMessageFound = ERRORS_MESSAGES_LIST['500'];
                setErrorMsg(errorMessageFound);
                break;

            default:
                navigate('/');
                break;
        }
    }, []);

    return (
        errorMsg ? (
          <div className='flex h-screen w-screen flex-col justify-center bg-[#F4F4F6]'>
            <div className={`w-[90vw] ${errorMsgWrapperSize} self-center`}>
              <Typography text={t(errorMsg?.codeMeaning)} className='text-[18px] font-normal leading-[24px] lg:text-[22px] lg:leading-[32px] lg:tracking-normal' />

              <Typography text={t(errorMsg?.messageHeadline)} className='tracking-extra1 text-[40px] font-normal leading-[48px] lg:text-[52px] lg:leading-[64px] lg:-tracking-wide' />

              <Typography text={t(errorMsg?.messageDescription)} className='text-[22px] font-normal leading-[32px] tracking-normal ' />
            </div>
          </div>
        ) :null
    );

};
