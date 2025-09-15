import { Icon } from '@components/Icon';
import type { IconIds } from '@components/Icon/Icon';
import { Typography } from '@components/Typography';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useLocation } from 'wouter';
import { useUserType } from '@shared/hooks/useUserType';


export type SmallCardPropsType = {
  iconId: IconIds;
  titleStyling?: string;
  cardTitle: string;
  description: string;
  navigateToUrl: string;
};


const getSmallCardData = (isAdmin: boolean): SmallCardPropsType[] => {
  const baseCards: SmallCardPropsType[] = [
    {
      iconId: 'user-group-icon',
      cardTitle: 'survey',
      description: 'setupAndManageSurveys',
      navigateToUrl: '/surveys',
    },
  ];

  // Only show users management for admins
  if (isAdmin) {
    baseCards.push({
      iconId: 'user-group-icon',
      cardTitle: 'users',
      description: 'createAndManageUser',
      navigateToUrl: '/users',
    });
  }

  return baseCards;
};

export const HomePage = () => {
  const { t } = useTranslation();
  const { userType, isAdmin, isAgent } = useUserType();

  return (
    <div className='page-without-header flex min-h-screen flex-col justify-center bg-[#F4F4F6] p-5 md:pt-24'>
      <div>
        <div className='m-auto mb-10 w-[285px] text-center text-[40px] font-[700] leading-[48px] -tracking-[0.08] text-[#0A0C11] md:mb-24 lg:text-[52px] lg:leading-[64px]'>
          {t('home')}
        </div>

        {/* User Type Display */}
        <div className='m-auto mb-6 w-[100%] rounded-xl border-[1px] border-[#DDDFE4] bg-[#FFF] p-4 md:w-[80%] lg:w-[816px]'>
          <Typography
            text={`${t('welcomeLoggedInAs')} ${userType}`}
            className='text-center text-lg font-medium text-[#166298]'
          />
          {isAdmin && (
            <Typography
              text={t('adminPrivileges')}
              className='mt-2 text-center text-sm text-[#F49E15]'
            />
          )}
          {isAgent && (
            <Typography
              text={t('agentPrivileges')}
              className='mt-2 text-center text-sm text-[#659FDC]'
            />
          )}
        </div>

        <div className='m-auto flex min-h-[200px] w-[100%] flex-col justify-center rounded-xl border-[1px] border-[#DDDFE4] bg-[#FFF] p-5 md:w-[80%] lg:w-[816px]'>
          <div className='flex flex-col justify-between gap-4 md:flex-row'>
            {getSmallCardData(isAdmin).map((card, index) => (
              <SmallCard key={index + card.cardTitle} {...card} />
            ))}
          </div>

        </div>
      </div>
    </div>
  );
};

const SmallCard = ({ iconId, titleStyling, cardTitle, description, navigateToUrl }: SmallCardPropsType) => {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const [hoverIsActive, setHoverIsActive] = useState(false);

  const navigateTo = () => {
    navigate(navigateToUrl);
  };

  return (
    <div className='mb-3 w-[100%] rounded-xl border-[2px] border-[#DDDFE4] bg-white p-6 shadow hover:border-[2px] hover:border-[#659FDC] md:mb-0 md:mr-2 md:w-[380px] lg:mr-1'>
      <button
        type='button'
        aria-label={cardTitle}
        onClick={navigateTo}
        onMouseOver={() => setHoverIsActive(true)}
        onMouseLeave={() => setHoverIsActive(false)}
        onFocus={() => setHoverIsActive(true)}
        onBlur={() => setHoverIsActive(false)}
        className='flex w-full items-center border-none bg-transparent p-0 text-left outline-none focus-visible:ring-2 focus-visible:ring-[#659FDC]'
      >
        <Icon
          id={iconId}
          className={`size-8 ${hoverIsActive ? 'text-[#F49E15]' : 'text-[#5B616D]'}`}
        />
        <Typography
          text={t(cardTitle)}
          className={`ml-1 text-[22px] font-normal leading-[32px] text-[#166298] lg:tracking-normal ${hoverIsActive ? 'underline' : ''} ${titleStyling}`}
        />
      </button>
      <Typography text={t(description)} className='font-normal text-[#5B616D] lg:text-[15px] lg:leading-[24px] lg:tracking-normal' />
    </div>
  );
};

