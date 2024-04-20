import {
  Button,
  Card,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@app-center/shadcn/ui';
import { cn } from '@app-center/shadcn/util';
import { useTranslations } from 'next-intl';
import { Control, useFormContext } from 'react-hook-form';
import { Icons } from '../../../../components/icons';

const StepOne = () => {
  const t = useTranslations('OnBoarding');
  const { watch, setValue, control } = useFormContext();
  return (
    <div className="items-center text-center">
      <h4>{t('Workspace Setup')}</h4>
      <h1 className="text-2xl">
        {t('Are you a freelancer or part of a company')}
      </h1>

      <FormField
        control={control}
        name="type"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <div className="grid grid-cols-2 gap-12 p-6">
                <FormControl>
                  <Card
                    onClick={() => {
                      field.onChange('freelancer');
                    }}
                    className={cn(
                      'grid items-center grid-rows-2 gap-5 py-12 text-center cursor-pointer hover:border-black dark:hover:border-white',
                      field.value === 'freelancer' &&
                        'bg-accent text-accent-foreground border-primary'
                    )}
                  >
                    <Icons.user className="mx-auto" />
                    {t('Im a freelancer')}
                  </Card>
                </FormControl>
                <FormControl>
                  <Card
                    onClick={() => {
                      field.onChange('company');
                    }}
                    className={cn(
                      'grid items-center grid-rows-2 gap-5 py-12 text-center cursor-pointer hover:border-black dark:hover:border-white',
                      field.value === 'company' &&
                        'bg-accent text-accent-foreground border-primary hover:border-primary dark:hover:border-primary'
                    )}
                  >
                    <Icons.users className="mx-auto" />
                    {t('I belong to a company')}
                  </Card>
                </FormControl>
              </div>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Next Button */}
      <Button
        className="w-full"
        disabled={watch('type') === ''}
        onClick={() => {
          setValue('step', 1);
        }}
      >
        {t('Next')}
      </Button>
    </div>
  );
};
export default StepOne;
