"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../ui/CustomFormField"
import SubmitButton from "../ui/SubmitButton"
import { useState } from "react"
import { PatientFormValidation, UserFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { createUser } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup } from "@radix-ui/react-radio-group"
import { Doctors, GenderOptions } from "@/constants"
import { RadioGroupItem } from "../ui/radio-group"
import { Label } from "../ui/label"
import { SelectItem } from "@/components/ui/select";
import Image from "next/image"
import {
  IdentificationTypes,
  PatientFormDefaultValues,
} from "@/constants";
import FileUploader from "../FileUploader"
import { registerPatient } from "@/lib/actions/patient.actions"

const RegisterForm = ({user}: {user: User}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email:"",
      phone:"",

    },
  })
 
  // 2. Define a submit handler.
  async function onSubmit( values: z.infer<typeof PatientFormValidation>) {
   setIsLoading(true);

   let formData;
   if (
     values.identificationDocument &&
     values.identificationDocument?.length > 0
   ) {
     const blobFile = new Blob([values.identificationDocument[0]], {
       type: values.identificationDocument[0].type,
     });

     formData = new FormData();
     formData.append("blobFile", blobFile);
     formData.append("fileName", values.identificationDocument[0].name);
   }
    try {
      const patientData = {
        ...values,
        userId: user.$id,
        birthDate: new Date(values.birthDate),
        identificationDocument: formData,
        privacyConsent: values.privacyConsent,
      };
      //@ts-ignore
      const patient = await registerPatient(patientData);

      if (patient) router.push(`/patients/${user.$id}/new-appointment`);   
    }  catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
    <form onSubmit={form.handleSubmit(onSubmit)} 
    className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Welcome 👋</h1>
            <p className="text-dark-700">Let us know more about yourself.</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 spaace-y-1">
            <h2 className="sub-header">Personal Information</h2>
            </div>
        </section>

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name = "name"
        label="Full Name"
        placeholder = "Siddharth Tiwari"
        iconSrc = "/assets/icons/user.svg"
        iconAlt = "user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
         <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name = "email"
        label = "Email"
        placeholder = "siddharth123@gmail.com"
        iconSrc = "/assets/icons/email.svg"
        iconAlt = "email"
        />
        <CustomFormField 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name = "phone"
        label = "Phone number"
        placeholder = "(+91) 0123456789"
        />
      </div>


        <div className="flex flex-col gap-6
        xl:flex-row">
              <CustomFormField 
        fieldType={FormFieldType.DATE_PICKER}
        control={form.control}
        name = "BirthDate"
        label = "Date of Birth"
        />
        <CustomFormField 
        fieldType={FormFieldType.SKELETON}
        control={form.control}
        name = "gender"
        label = "Gender"
        renderSkeleton={(field)=>(
            <FormControl>
                <RadioGroup className="flex h-11 gap-6 xl:justify-between"
                onValueChange={field.onChange}
                defaultValue={field.value}>
                    {GenderOptions.map((option) =>
                    (
                        <div key={option} 
                        className="radio-group">
                          <RadioGroupItem value={option} id={option}/>

                          <Label htmlFor={option}
                          className="cursor-pointer"
                          >
                            {option}
                          </Label>

                        </div>
                    )
                    )}

                </RadioGroup>
            </FormControl>
        )}
        />
        </div>

        <div className="flex flex-col gap-6
        xl:flex-row">
             <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name = "address"
        label = "Address"
        placeholder = "202 A1 Royal City, Jabalpur, M.P."
        />

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name = "occupation"
        label = "Occupation"
        placeholder = "Software Engineer"
        />
        </div>

        <div className="flex flex-col gap-6
        xl:flex-row">

        <CustomFormField 
        fieldType={FormFieldType.INPUT}
        control={form.control}
        name = "emergencyContactName"
        label = "Emergency contact name"
        placeholder = "Guardian's name"
        />
        <CustomFormField 
        fieldType={FormFieldType.PHONE_INPUT}
        control={form.control}
        name = "emergencyContactNumber"
        label = "Emergency contact number"
        placeholder = "(+91) 0123456789"
        />
      </div>
      
       <section className="space-y-6">
            <div className="mb-9 spaace-y-1">
            <h2 className="sub-header">Medical Infromation</h2>
            </div>
        </section>


        <CustomFormField 
        fieldType={FormFieldType.SELECT}
        control={form.control}
        name = "primaryPhysician"
        label = "Primary Physician"
        placeholder = "Select a physician"
        >
         {Doctors.map((doctor) => (
          <SelectItem key={doctor.name} value = 
          {doctor.name}>
            <div className="flex cursor-point items-center gap-2">
              <Image
              src={doctor.image}
              width={32}
              height={32}
              alt={doctor.name}
              className="rounded-full border boredr-dark-500"
              />
              <p>
                {doctor.name}
              </p>

            </div>
          </SelectItem>

         ))}
        </CustomFormField>


        <div className="flex flex-col gap-6
        xl:flex-row">
             <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insuranceProvider"
              label="Insurance provider"
              placeholder="BlueCross BlueShield"
            />

            <CustomFormField
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name="insurancePolicyNumber"
              label="Insurance policy number"
              placeholder="ABC123456789"
            />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="allergies"
              label="Allergies (if any)"
              placeholder="Peanuts, Penicillin, Pollen"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="currentMedication"
              label="Current medications (if any)"
              placeholder="Ibuprofen 200mg, Levothyroxine 50mcg"
            />
          </div>

          <div className="flex flex-col gap-6 xl:flex-row">
            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="familyMedicalHistory"
              label=" Family medical history (if relevant)"
              placeholder="Mother had brain cancer, Father has hypertension"
            />

            <CustomFormField
              fieldType={FormFieldType.TEXTAREA}
              control={form.control}
              name="pastMedicalHistory"
              label="Past medical history"
              placeholder="Appendectomy in 2015, Asthma diagnosis in childhood"
            />
          </div>

          <section className="space-y-6">
            <div className="mb-9 spaace-y-1">
            <h2 className="sub-header">Identification and verification</h2>
            </div>
        </section>


        <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="identificationType"
            label="Identification Type"
            placeholder="Select an identification type"
          >
            {IdentificationTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type}
              </SelectItem>
            ))}
          </CustomFormField>

          <CustomFormField
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="identificationNumber"
            label="Identification Number"
            placeholder="123456789"
          />

          <CustomFormField
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name="identificationDocument"
            label="Scanned Copy of Identification Document"
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />


         <section className="space-y-6">
            <div className="mb-9 spaace-y-1">
            <h2 className="sub-header">Consent and Privacy</h2>
            </div>
        </section>
       
          

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="treatmentConsent"
            label="I consent to receive treatment for my health condition."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="disclosureConsent"
            label="I consent to the use and disclosure of my health
            information for treatment purposes."
          />

          <CustomFormField
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name="privacyConsent"
            label="I acknowledge that I have reviewed and agree to the
            privacy policy"
          />


      <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
    </form>
  </Form>
  )
}

export default RegisterForm