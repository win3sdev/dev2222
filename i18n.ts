import {notFound} from 'next/navigation';
import {getRequestConfig} from 'next-intl/server';
import {locales, defaultLocale, type Locale} from './i18n.config';

// 加载消息文件
async function getMessages(locale: string) {
  try {
    return (await import(`./messages/${locale}.json`)).default;
  } catch (error) {
    notFound();
  }
}

export default getRequestConfig(async ({locale}) => {
  // 验证请求的语言代码
  const validLocale = (locales.includes(locale as Locale) ? locale : defaultLocale) as Locale;

  return {
    locale: validLocale,
    messages: await getMessages(validLocale),
    timeZone: 'Asia/Shanghai'
  };
}); 