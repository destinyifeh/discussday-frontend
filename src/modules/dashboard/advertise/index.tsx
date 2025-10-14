'use client';

import {Button} from '@/components/ui/button';
import {Card, CardContent, CardHeader, CardTitle} from '@/components/ui/card';
import {CheckCircle, X} from 'lucide-react';
import {useState} from 'react';

import {PageHeader} from '@/components/app-headers';
import {toast} from '@/components/ui/toast';
import {pricingTiers} from '@/fixtures/ad';
import clsx from 'clsx';
import {useRouter} from 'next/navigation';

export const AdvertisePage = () => {
  const navigate = useRouter();

  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const [selectedTab, setSelectedTab] = useState('pricing');
  const [selectedDuration, setSelectedDuration] = useState('7');

  const onPlanSelected = (plan: string) => {
    console.log(plan, 'planooo');
    if (plan === 'Custom') {
      toast.info('Please contact support to set up a custom ad.');
      navigate.push(`/contact-support`);
      return;
    }
    setSelectedPlan(plan);
    //navigate.push(`/create-ad/${plan.toLowerCase()}`);

    navigate.push(`/advertise/create-ad?plan=${plan.toLowerCase()}`);
  };

  return (
    <div>
      <PageHeader
        title="Advertise with Us"
        description="Reach our engaged community with targeted advertising"
      />

      <div className="p-4">
        <div className="mb-8">
          <h2 className="text-lg font-bold mb-4">
            Choose Your Advertising Plan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pricingTiers.map(tier => (
              <Card
                key={tier.name}
                className={clsx(
                  'relative transition-all cursor-pointer',
                  selectedPlan === tier.name
                    ? 'border-app ring-2 ring-app ring-opacity-50'
                    : '',

                  tier.featured ? 'border-app' : '',
                )}
                onClick={() => setSelectedPlan(tier.name)}>
                {tier.featured && (
                  <div className="absolute top-0 right-0 -translate-y-1/2 px-3 py-1 bg-app text-white rounded-full text-xs font-medium">
                    Popular
                  </div>
                )}
                {selectedPlan === tier.name && (
                  <div className="absolute top-2 left-2 bg-app text-white rounded-full p-1">
                    <CheckCircle size={16} />
                  </div>
                )}
                <CardHeader>
                  <CardTitle>{tier.name}</CardTitle>
                  <div className="mt-2">
                    <span className="text-2xl font-bold">{tier.price}</span>
                    <span className="text-sm"> {tier.unit}</span>
                  </div>
                  <p className="text-sm">{tier.description}</p>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tier.features.map(feature => (
                      <li key={feature} className="flex items-center gap-2">
                        <CheckCircle size={16} className="text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                    {tier.limitations?.map(limitation => (
                      <li key={limitation} className="flex items-center gap-2">
                        {/* <span className="w-4 h-4 rounded-full bg-gray-200 flex-shrink-0"></span> */}
                        <X size={16} className="text-red-500" />
                        <span className="text-sm">{limitation}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className={`w-full mt-6 ${
                      tier.featured || selectedPlan === tier.name
                        ? 'bg-app hover:bg-app/90 dark:text-white'
                        : ''
                    }`}
                    onClick={() => {
                      onPlanSelected(tier.name);
                    }}>
                    {selectedPlan === tier.name ? 'Selected' : 'Select'}{' '}
                    {tier.name}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-lg font-bold mb-2">Why Advertise Here?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-app-hover border border-app-border dark:bg-background">
              <h3 className="font-bold mb-1">Engaged Audience</h3>
              <p className="text-sm">
                Our community is active and engaged, with high interaction
                rates.
              </p>
            </div>
            <div className="p-4 rounded-lg bg-app-hover border border-app-border dark:bg-background">
              <h3 className="font-bold mb-1">Targeted Reach</h3>
              <p className="text-sm">
                Reach users based on interests, categories, and engagement.
              </p>
            </div>
            {/* <div className="p-4 rounded-lg bg-app-hover border border-app-border dark:bg-background">
              <h3 className="font-bold mb-1">Multiple Formats</h3>
              <p className="text-sm">
                Choose from banners and sponsored posts.
              </p>
            </div> */}
            <div className="p-4 rounded-lg bg-app-hover border border-app-border dark:bg-background">
              <h3 className="font-bold mb-1">Sponsored Posts</h3>
              <p className="text-sm">
                Promote your content directly in the forum feed with native
                sponsored posts.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
