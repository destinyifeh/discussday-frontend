'use client';

import {PageHeader} from '@/components/app-headers';
import {Button} from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {toast} from '@/components/ui/toast';
import {
  MAX_FILE_SIZE,
  MIN_AD_IMAGE_HEIGHT,
  MIN_AD_IMAGE_WIDTH,
} from '@/constants/api-resources';
import {Sections} from '@/constants/data';
import {
  BASIC_PLAN_DESCRIPTION,
  ctaBtn,
  ENTERPRISE_PLAN_DESCRIPTION,
  enterpriseDurations,
  PROFESSIONAL_PLAN_DESCRIPTION,
} from '@/fixtures/ad';
import {useAdStore} from '@/hooks/stores/use-ad-store';
import {urlFormatter} from '@/lib/formatter';
import {AdCTA, AdPlan, AdType, DurationValue} from '@/types/ad-types';
import {ArrowRight, Upload} from 'lucide-react';
import {useRouter, useSearchParams} from 'next/navigation';
import {ChangeEvent, Fragment, useRef, useState} from 'react';
import {CreateAdDto} from '../dto/create-ad.dto';
import {AdPreviewPage} from '../preview';

export const AdPlanPage = () => {
  // const {plan} = useParams<{plan: AdPlan}>();
  const searchParam = useSearchParams();

  const plan = searchParam.get('plan') as AdPlan;
  const navigate = useRouter();
  const [isPreviewPage, setIsPreviewPage] = useState(false);
  const {setPreviewAdData} = useAdStore(state => state);
  const [previewData, setPreviewData] = useState<CreateAdDto>({
    title: '',
    content: '',
    targetUrl: '',
    type: 'sponsored' as AdType,
    section: '',
    callToAction: AdCTA.None,
    duration: '7' as DurationValue,
    plan: plan,
    price: '',
    imageUrl: '',
    image: null,
    targetType: '',
    whatsappNumber: '',
  });

  console.log(plan, 'planno');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload3 = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewData(prev => ({
          ...prev,
          image: file,
          imageUrl: reader.result as string,
          useTextOnly: false,
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleImageUpload2 = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // ✅ File size check
    if (file.size > MAX_FILE_SIZE) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // ✅ File type check
    if (!file.type.startsWith('image/')) {
      toast.error('Please select a valid image file');
      return;
    }

    // ✅ Validate minimum dimensions
    const img = new Image();
    img.onload = () => {
      const {width, height} = img;

      console.log(width, height, 'w-hh');

      if (width < MIN_AD_IMAGE_WIDTH || height < MIN_AD_IMAGE_HEIGHT) {
        toast.error(
          `Image must be at least ${MIN_AD_IMAGE_WIDTH}x${MIN_AD_IMAGE_HEIGHT}px`,
        );
        return;
      }

      // ✅ Passed all checks → set preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewData(prev => ({
          ...prev,
          image: file,
          imageUrl: reader.result as string,
          useTextOnly: false,
        }));
      };
      reader.readAsDataURL(file);
    };

    img.src = URL.createObjectURL(file);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error('Image size should be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const img = new Image();
        img.onload = () => {
          // ✅ You now have width & height
          const width = img.width;
          const height = img.height;

          console.log(width, height, 'width, height');

          setPreviewData(prev => ({
            ...prev,
            image: file,
            imageUrl: reader.result as string,
            imageWidth: width,
            imageHeight: height,
            useTextOnly: false,
          }));

          console.log('Image dimensions:', width, height);
        };

        img.src = reader.result as string;
      };

      reader.readAsDataURL(file);
    }
  };

  const handleSubmitForApproval = () => {
    const data = {
      ...previewData,
      targetUrl: previewData.targetUrl
        ? urlFormatter(previewData.targetUrl)
        : '',
    };
    setPreviewAdData(data);
    setIsPreviewPage(true);
    // toast.success('Your advertisement has been submitted for approval!');
    //navigate.push(`/create-ad/ad-preview`);
  };

  const disablePreviewBtn = () => {
    const {
      title,
      targetUrl,
      imageUrl,
      duration,
      content,
      callToAction,
      section,
      type,
    } = previewData;

    // Only the basic & professional plans require section
    const requiresSection = plan === 'basic' || plan === 'professional';

    const isCommonInvalid =
      title.length < 5 || !duration || (requiresSection && !section);

    // ✅ Fix: Ensure content is not empty and has min length
    const isContentInvalid = !content || content.trim().length < 50;

    if (isContentInvalid || isCommonInvalid) {
      return true; // disable button
    }

    return false; // enable button
  };

  let planDescription = '';

  switch (plan) {
    case 'basic':
      planDescription = BASIC_PLAN_DESCRIPTION;
      break;
    case 'professional':
      planDescription = PROFESSIONAL_PLAN_DESCRIPTION;
      break;
    case 'enterprise':
    default:
      planDescription = ENTERPRISE_PLAN_DESCRIPTION;
      break;
  }

  const handleBack = () => {
    navigate.back();
  };

  return (
    <div>
      <PageHeader
        title="Advertise with Us"
        description="Reach our engaged community with targeted advertising"
      />

      <div className="p-4">
        <p className="text-sm text-app-gray mt-2">{planDescription}</p>
      </div>

      {isPreviewPage && <AdPreviewPage setIsPreviewPage={setIsPreviewPage} />}

      {!isPreviewPage && (
        <Fragment>
          <div className="p-4 ">
            <div className="md:flex flex-row flex-wrap gap-8 items-center">
              <div className="mb-5 md:mb-0">
                <h2 className="text-lg font-bold mb-4">Select Duration</h2>
                <Select
                  value={previewData.duration}
                  onValueChange={value => {
                    setPreviewData(prev => ({
                      ...prev,
                      duration: value as DurationValue,
                    }));
                  }}>
                  <SelectTrigger className="w-full md:w-[300px] mb-2">
                    <SelectValue placeholder="Select duration" />
                  </SelectTrigger>
                  <SelectContent>
                    {enterpriseDurations.map(duration => (
                      <SelectItem key={duration.value} value={duration.value}>
                        <div className="flex items-center justify-between w-full">
                          <span>{duration.label}</span>
                          <div className="flex items-center">
                            <span className="font-medium text-app ml-1 mr-3">
                              {duration.price}
                            </span>
                            {duration.discount && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                {duration.discount}
                              </span>
                            )}
                          </div>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              {plan !== 'enterprise' && (
                <div className="mb-5 md:mb-0">
                  <h2 className="text-lg font-bold mb-4">Target Section</h2>
                  <Select
                    value={previewData.section}
                    onValueChange={value => {
                      setPreviewData(prev => ({...prev, section: value}));
                    }}>
                    <SelectTrigger className="w-full md:w-[300px] form-input">
                      <SelectValue placeholder="Select section" />
                    </SelectTrigger>
                    <SelectContent>
                      {Sections.map(section => (
                        <SelectItem key={section.id} value={section.name}>
                          {section.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="mb-5 w-full md:w-[300px] md:mb-0">
                <h2 className="text-lg font-bold mb-4">
                  Destination (Optional)
                </h2>
                <Select
                  value={previewData.targetType}
                  onValueChange={value => {
                    setPreviewData(prev => ({...prev, targetType: value}));
                  }}>
                  <SelectTrigger className="w-full md:w-[300px] form-input">
                    <SelectValue placeholder="Choose destination" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="website">Website</SelectItem>
                    <SelectItem value="whatsapp">WhatsApp</SelectItem>
                    <SelectItem value="none">None</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground mt-2">
                  Where users will go when they click your ad.
                </p>
              </div>

              {previewData.targetType === 'website' && (
                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <input
                    type="url"
                    className="w-full p-2 border rounded-md mt-2 form-input"
                    placeholder="https://example.com"
                    value={previewData.targetUrl}
                    onChange={e =>
                      setPreviewData(prev => ({
                        ...prev,
                        targetUrl: e.target.value,
                      }))
                    }
                  />
                </div>
              )}

              {previewData.targetType === 'whatsapp' && (
                <div className="mb-5 w-full md:w-[300px] md:mb-0">
                  <input
                    type="tel"
                    className="w-full p-2 border rounded-md mt-2 form-input"
                    placeholder=" Enter (e.g. 2348012345678)"
                    value={previewData.whatsappNumber}
                    onChange={e =>
                      setPreviewData(prev => ({
                        ...prev,
                        whatsappNumber: e.target.value,
                        targetUrl: `https://wa.me/${e.target.value}`,
                      }))
                    }
                  />
                </div>
              )}

              {previewData.targetType !== 'none' &&
                previewData.targetType !== '' && (
                  <div className="mb-5 w-full md:w-[300px] md:mb-0">
                    <h2 className="text-lg font-bold mb-4">
                      Call to Action Button
                    </h2>
                    <Select
                      value={previewData.callToAction}
                      onValueChange={value => {
                        setPreviewData(prev => ({
                          ...prev,
                          callToAction: value as AdCTA,
                        }));
                      }}>
                      <SelectTrigger className="w-full md:w-[300px] form-input">
                        <SelectValue placeholder="Select section" />
                      </SelectTrigger>
                      <SelectContent>
                        {ctaBtn.map(cta => (
                          <SelectItem key={cta.name} value={cta.name}>
                            {cta.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              <div className="mb-5 w-full md:w-[300px] md:mb-0">
                <h2 className="text-lg font-bold mb-4">
                  {previewData.type === 'sponsored'
                    ? 'Ad Image (Optional)'
                    : 'Ad Image'}
                </h2>
                <div className="flex gap-2 items-center mt-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                  />
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 flex-1">
                    <Upload size={16} />{' '}
                    {previewData.imageUrl ? 'Change Image' : 'Upload Image'}
                  </Button>

                  {previewData.imageUrl && (
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        setPreviewData(prev => ({
                          ...prev,
                          imageUrl: '',
                          image: null,
                        }))
                      }>
                      Remove
                    </Button>
                  )}
                </div>

                {previewData.imageUrl && (
                  <div className="mt-2">
                    <img
                      src={previewData.imageUrl}
                      alt="Ad preview"
                      className="h-32 object-contain rounded border p-1 bg-gray-50"
                    />
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2">
                  Recommended size: 1200 x 900 pixels.
                </p>
              </div>

              <div className="mb-5 w-full md:mb-0">
                <h2 className="text-lg font-bold mb-4">Ad Title</h2>

                <input
                  type="text"
                  className="w-full p-2 border rounded-md form-input"
                  value={previewData.title}
                  onChange={e =>
                    setPreviewData(prev => ({...prev, title: e.target.value}))
                  }
                  placeholder="Enter a catchy title (5-50 characters)"
                  maxLength={50}
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {previewData.title?.length}/50 characters
                </p>
                <small>Title must be between 5 and 50 characters.</small>
              </div>

              <div className="mb-5 w-full md:mb-0">
                <h2 className="text-lg font-bold mb-4">Ad Description</h2>

                <textarea
                  className="w-full p-2 border rounded-md min-h-[100px] form-input"
                  value={previewData.content}
                  onChange={e =>
                    setPreviewData(prev => ({
                      ...prev,
                      content: e.target.value,
                    }))
                  }
                  maxLength={200}
                  placeholder="Describe your product or service (50-200 characters)"
                />
                <p className="text-xs text-muted-foreground mt-2">
                  {previewData?.content?.length}/200 characters
                </p>
                <small>
                  Description must be between 50 and 200 characters.
                </small>
              </div>
            </div>
          </div>

          <div className="flex justify-between mb-8 mx-10">
            <Button variant="outline" onClick={handleBack}>
              Back
            </Button>
            <Button
              disabled={disablePreviewBtn()}
              onClick={handleSubmitForApproval}
              className="bg-app hover:bg-app/90 text-white">
              Preview <ArrowRight className="ml-2" />
            </Button>
          </div>
        </Fragment>
      )}
    </div>
  );
};
