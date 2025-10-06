import {cn} from '@/lib/utils';
import Image from 'next/image';
import {FC} from 'react';

interface AppLogoProps {
  title?: string;
  color?: string;
  smSize?: string;
  mdSize?: string;
  mb?: string;
  center?: string;
}
interface CustomLogoProps {
  logo: string;

  height?: number;
  width?: number;
}

export const AppLogo: FC<AppLogoProps> = ({
  title,
  color,
  smSize,
  mb,
  center,
  mdSize,
}) => {
  return (
    <h1
      className={cn(
        'font-bold',
        color ?? 'text-white',
        smSize ?? 'text-3xl',
        mb ?? 'mb-8',
        center ?? 'text-center',
        mdSize ?? 'md:text-4xl',
      )}>
      {title ?? 'Discussday'}
    </h1>
  );
};

export const CustomLogo: FC<CustomLogoProps> = ({logo, height, width}) => {
  return (
    <Image
      src={logo}
      alt="Discussday"
      width={width ?? 140}
      height={height ?? 140}
      className="text-app"
    />
  );
};
