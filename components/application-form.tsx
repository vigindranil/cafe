'use client';

import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Loader2, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ApiConfig } from '@/api/api';

// Form Schema
const formSchema = z.object({
  applicant_name: z.string().min(1, 'Applicant name is required'),
  father_name: z.string().min(1, 'Father\'s name is required'),
  mobile_no: z.string().min(10, 'Mobile number must be 10 digits'),
  email: z.string().email('Invalid email address'),
  address: z.string().min(1, 'Address is required'),
  area: z.enum(['urban', 'rural']),
  block: z.string().optional(),
  village: z.string().optional(),
  municipality_id: z.string().optional(),
  ward_no: z.number().optional(),
  panchayat: z.string().optional(),
  state_id: z.string().min(1, 'State is required'),
  district_id: z.string().min(1, 'District is required'),
  police_station_id: z.string().optional(),
  post_office_id: z.string().optional(),
  pincode: z.string().min(6, 'PIN code must be 6 digits'),
  applicant_query: z.array(z.object({
    query: z.string().min(1, 'Question is required'),
    pollution_id: z.string().min(1, 'Category is required'),
  })),
  bpl: z.boolean(),
  bpl_file: z.any().optional(),
  fees_receive: z.boolean(),
  fees_type_id: z.string().optional(),
  total_fees: z.number().optional(),
  fees_not_receive_reason: z.string().optional(),
});

interface ApplicationFormProps {
  applicationDetails?: any;
}

export function ApplicationForm({ applicationDetails }: ApplicationFormProps) {
  const [area, setArea] = useState<'urban' | 'rural'>('urban');
  const [bpl, setBpl] = useState(false);
  const [feesReceived, setFeesReceived] = useState(false);
  const [buttonLoading, setButtonLoading] = useState(false);
  const [states, setStates] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [policeStation, setPoliceStation] = useState<any[]>([]);
  const [postOffices, setPostOffices] = useState<any[]>([]);
  const [allMunicipalities, setAllMunicipalities] = useState<any[]>([]);
  const [type, setType] = useState<any[]>([]);
  const [feesCategory, setFeesCategory] = useState<any[]>([]);
  const [questions, setQuestions] = useState([{ id: '1' }]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      applicant_name: '',
      father_name: '',
      mobile_no: '',
      email: '',
      address: '',
      area: 'urban',
      block: '',
      village: '',
      municipality_id: '',
      ward_no: undefined,
      panchayat: '',
      state_id: '',
      district_id: '',
      police_station_id: '',
      post_office_id: '',
      pincode: '',
      applicant_query: [{ query: '', pollution_id: '' }],
      bpl: false,
      bpl_file: undefined,
      fees_receive: false,
      fees_type_id: '',
      total_fees: undefined,
      fees_not_receive_reason: '',
    },
  });

  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const token = localStorage.getItem('token');
        const headers = { 'Authorization': `Bearer ${token}` };

        // Fetch all required data
        const [
          statesRes,
          pollutionRes,
          feesCategoryRes,
          municipalitiesRes
        ] = await Promise.all([
          fetch(ApiConfig.GET_STATES, { headers }),
          fetch(ApiConfig.GET_POLLUTION, { headers }),
          fetch(ApiConfig.GET_FEES_CATEGORY, { headers }),
          fetch(ApiConfig.GET_MUNICIPALITY, { headers })
        ]);

        const [
          statesData,
          pollutionData,
          feesCategoryData,
          municipalitiesData
        ] = await Promise.all([
          statesRes.json(),
          pollutionRes.json(),
          feesCategoryRes.json(),
          municipalitiesRes.json()
        ]);

        setStates(statesData.data || []);
        setType(pollutionData.data || []);
        setFeesCategory(feesCategoryData.data || []);
        setAllMunicipalities(municipalitiesData.data || []);

        if (applicationDetails) {
          form.reset(applicationDetails);
          setArea(applicationDetails.area);
          setBpl(applicationDetails.bpl);
          setFeesReceived(applicationDetails.fees_receive);
          setQuestions(applicationDetails.applicant_query.map((q: any, i: number) => ({ id: String(i + 1) })));
        }
      } catch (error) {
        console.error('Error fetching initial data:', error);
      }
    };

    fetchInitialData();
  }, [applicationDetails, form]);

  const getDistricts = async (stateId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiConfig.GET_DISTRICT}?state_id=${stateId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setDistricts(data.data || []);
    } catch (error) {
      console.error('Error fetching districts:', error);
    }
  };

  const getPoliceStations = async (districtId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiConfig.GET_POLICE}?district_id=${districtId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPoliceStation(data.data || []);
    } catch (error) {
      console.error('Error fetching police stations:', error);
    }
  };

  const getPostOffices = async (policeStationId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${ApiConfig.GET_POST_OFFICE}?police_station_id=${policeStationId}`, {
        headers: { 'Authorization': `Bearer ${token}` },
      });
      const data = await response.json();
      setPostOffices(data.data || []);
    } catch (error) {
      console.error('Error fetching post offices:', error);
    }
  };

  const handleAddQuestion = () => {
    setQuestions([...questions, { id: String(questions.length + 1) }]);
    form.setValue('applicant_query', [
      ...form.getValues('applicant_query'),
      { query: '', pollution_id: '' }
    ]);
  };

  const handleRemoveQuestion = (id: string) => {
    const newQuestions = questions.filter(q => q.id !== id);
    setQuestions(newQuestions);
    form.setValue('applicant_query', form.getValues('applicant_query').filter((_, index) => 
      String(index + 1) !== id
    ));
  };

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setButtonLoading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();

      // Append all form fields to formData
      Object.entries(values).forEach(([key, value]) => {
        if (key === 'applicant_query') {
          formData.append(key, JSON.stringify(value));
        } else if (key === 'bpl_file' && value instanceof File) {
          formData.append(key, value);
        } else {
          formData.append(key, String(value));
        }
      });

      const url = applicationDetails 
        ? `${ApiConfig.UPDATE_APPLICATION}/${applicationDetails.id}`
        : ApiConfig.CREATE_APPLICATION;

      const response = await fetch(url, {
        method: applicationDetails ? 'PUT' : 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (data.errorCode === 0) {
        // Handle success
        console.log('Application submitted successfully');
      } else {
        // Handle error
        console.error('Error submitting application:', data.message);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setButtonLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-2xl overflow-hidden">
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
        <h1 className="text-3xl font-bold text-white">
          {applicationDetails ? 'Edit Application' : 'New Application'}
        </h1>
        <p className="text-blue-100 mt-2">
          Please fill out all required fields
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleSubmit)} className="p-6 space-y-8">
          <Accordion type="single" collapsible className="w-full" defaultValue="applicant-details">
            {/* Applicant Details Section */}
            <AccordionItem value="applicant-details">
              <AccordionTrigger className="bg-gradient-to-r from-blue-500 to-blue-600 text-white px-4 py-2 rounded-t-lg hover:no-underline">
                Applicant Details
              </AccordionTrigger>
              <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-6 bg-blue-50">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Applicant Name */}
                  <FormField
                    control={form.control}
                    name="applicant_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Applicant Name*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter applicant name"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Father's Name */}
                  <FormField
                    control={form.control}
                    name="father_name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Father's Name*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter father's name"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Mobile Number */}
                  <FormField
                    control={form.control}
                    name="mobile_no"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Mobile Number*</FormLabel>
                        <FormControl>
                          <Input
                            type="tel"
                            placeholder="Enter mobile number"
                            {...field}
                            maxLength={10}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Email */}
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Email*</FormLabel>
                        <FormControl>
                          <Input
                            type="email"
                            placeholder="Enter email address"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Address */}
                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel className="text-blue-700">Address*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Enter complete address"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Area Type */}
                  <FormField
                    control={form.control}
                    name="area"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Area Type*</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-4">
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={field.value === 'urban'}
                                onChange={() => {
                                  field.onChange('urban');
                                  setArea('urban');
                                }}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>Urban</span>
                            </label>
                            <label className="flex items-center space-x-2">
                              <input
                                type="radio"
                                checked={field.value === 'rural'}
                                onChange={() => {
                                  field.onChange('rural');
                                  setArea('rural');
                                }}
                                className="text-blue-600 focus:ring-blue-500"
                              />
                              <span>Rural</span>
                            </label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Block */}
                  <FormField
                    control={form.control}
                    name="block"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Block</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter block"
                            {...field}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Conditional Fields based on Area Type */}
                  {area === 'rural' ? (
                    <>
                      <FormField
                        control={form.control}
                        name="village"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-700">Village</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter village name"
                                {...field}
                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="panchayat"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-700">Panchayat</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="Enter panchayat name"
                                {...field}
                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  ) : (
                    <>
                      <FormField
                        control={form.control}
                        name="municipality_id"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-700">Municipality</FormLabel>
                            <Select
                              onValueChange={field.onChange}
                              value={field.value}
                            >
                              <FormControl>
                                <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                                  <SelectValue placeholder="Select municipality" />
                                </SelectTrigger>
                              </FormControl>
                              <SelectContent>
                                {allMunicipalities.map((municipality) => (
                                  <SelectItem
                                    key={municipality.id}
                                    value={municipality.id}
                                  >
                                    {municipality.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="ward_no"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-blue-700">Ward No.</FormLabel>
                            <FormControl>
                              <Input
                                type="number"
                                placeholder="Enter ward number"
                                {...field}
                                onChange={(e) => field.onChange(parseInt(e.target.value))}
                                className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                  {/* Location Fields */}
                  <FormField
                    control={form.control}
                    name="state_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">State*</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            getDistricts(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                              <SelectValue placeholder="Select state" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {states.map((state) => (
                              <SelectItem
                                key={state.id}
                                value={state.id}
                              >
                                {state.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="district_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">District*</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            getPoliceStations(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                              <SelectValue placeholder="Select district" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {districts.map((district) => (
                              <SelectItem
                                key={district.id}
                                value={district.id}
                              >
                                {district.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="police_station_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Police Station</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            getPostOffices(value);
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                              <SelectValue placeholder="Select police station" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {policeStation.map((station) => (
                              <SelectItem
                                key={station.id}
                                value={station.id}
                              >
                                {station.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="post_office_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">Post Office</FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger className="border-blue-200 focus:border-blue-400 focus:ring-blue-400">
                              <SelectValue placeholder="Select post office" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {postOffices.map((office) => (
                              <SelectItem
                                key={office.id}
                                value={office.id}
                              >
                                {office.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="pincode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-blue-700">PIN Code*</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Enter PIN code"
                            {...field}
                            maxLength={6}
                            className="border-blue-200 focus:border-blue-400 focus:ring-blue-400"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </AccordionContent>
            </AccordionItem>

            {/* Question Details Section */}
            <AccordionItem value="question-details">
              <AccordionTrigger className="bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-t-lg hover:no-underline">
                Question Details
              </AccordionTrigger>
              <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-6 bg-green-50">
                {questions.map((question, index) => (
                  <div key={question.id} className="flex gap-4 items-start">
                    <FormField
                      control={form.control}
                      name={`applicant_query.${index}.query`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormLabel className="text-green-700">Question {index + 1}*</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Enter your question"
                              {...field}
                              className="border-green-200 focus:border-green-400 focus:ring-green-400"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`applicant_query.${index}.pollution_id`}
                      render={({ field }) => (
                        <FormItem className="w-1/3">
                          <FormLabel className="text-green-700">Category*</FormLabel>
                          <Select
                            onValueChange={field.onChange}
                            value={field.value}
                          >
                            <FormControl>
                              <SelectTrigger className="border-green-200 focus:border-green-400 focus:ring-green-400">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {type.map((t) => (
                                <SelectItem
                                  key={t.id}
                                  value={t.id}
                                >
                                  {t.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    {questions.length > 1 && (
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => handleRemoveQuestion(question.id)}
                        className="mt-8"
                      >
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleAddQuestion}
                  className="w-full mt-4"
                >
                  Add Another Question
                </Button>
              </AccordionContent>
            </AccordionItem>

            {/* Fees Details Section */}
            <AccordionItem value="fees-details">
              <AccordionTrigger className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2 rounded-t-lg hover:no-underline">
                Fees Details
              </AccordionTrigger>
              <AccordionContent className="p-4 border border-t-0 rounded-b-lg space-y-6 bg-purple-50">
                <FormField
                  control={form.control}
                  name="bpl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-purple-700">BPL Status*</FormLabel>
                      <FormControl>
                        <div className="flex items-center space-x-4">
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={field.value === true}
                              onChange={() => {
                                field.onChange(true);
                                setBpl(true);
                              }}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span>Yes</span>
                          </label>
                          <label className="flex items-center space-x-2">
                            <input
                              type="radio"
                              checked={field.value === false}
                              onChange={() => {
                                field.onChange(false);
                                setBpl(false);
                              }}
                              className="text-purple-600 focus:ring-purple-500"
                            />
                            <span>No</span>
                          </label>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {bpl && (
                  <FormField
                    control={form.control}
                    name="bpl_file"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-purple-700">BPL Certificate*</FormLabel>
                        <FormControl>
                          <div className="flex items-center space-x-2">
                            <Input
                              type="file"
                              onChange={(e) => field.onChange(e.target.files?.[0])}
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="border-purple-200 hover:bg-purple-100"
                            >
                              <Upload className="h-4 w-4 text-purple-600" />
                            </Button>
                          </div>
                        </FormControl>
                        <FormDescription className="text-purple-600">
                          Upload BPL certificate (PDF, JPG, PNG)
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {!bpl && (
                  <>
                    <FormField
                      control={form.control}
                      name="fees_receive"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-purple-700">Fees Received*</FormLabel>
                          <FormControl>
                            <div className="flex items-center space-x-4">
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={field.value === true}
                                  onChange={() => {
                                    field.onChange(true);
                                    setFeesReceived(true);
                                  }}
                                  className="text-purple-600 focus:ring-purple-500"
                                />
                                <span>Yes</span>
                              </label>
                              <label className="flex items-center space-x-2">
                                <input
                                  type="radio"
                                  checked={field.value === false}
                                  onChange={() => {
                                    field.onChange(false);
                                    setFeesReceived(false);
                                  }}
                                  className="text-purple-600 focus:ring-purple-500"
                                />
                                <span>No</span>
                              </label>
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {feesReceived ? (
                      <>
                        <FormField
                          control={form.control}
                          name="fees_type_id"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700">Fees Type*</FormLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <FormControl>
                                  <SelectTrigger className="border-purple-200 focus:border-purple-400 focus:ring-purple-400">
                                    <SelectValue placeholder="Select fees type" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  {feesCategory.map((category) => (
                                    <SelectItem
                                      key={category.id}
                                      value={category.id}
                                    >
                                      {category.name}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="total_fees"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-purple-700">Total Fees*</FormLabel>
                              <FormControl>
                                <Input
                                  type="number"
                                  placeholder="Enter total fees"
                                  {...field}
                                  onChange={(e) => field.onChange(parseFloat(e.target.value))}
                                  className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </>
                    ) : (
                      <FormField
                        control={form.control}
                        name="fees_not_receive_reason"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-purple-700">Reason for Not Receiving Fees*</FormLabel>
                            <FormControl>
                              <Textarea
                                placeholder="Enter reason"
                                {...field}
                                className="border-purple-200 focus:border-purple-400 focus:ring-purple-400"
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    )}
                  </>
                )}
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => form.reset()}
              className="bg-white text-blue-600 border-blue-600 hover:bg-blue-50"
            >
              Clear
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 text-white hover:bg-blue-700"
              disabled={buttonLoading}
            >
              {buttonLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Submit'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}