'use client';

import { useEffect, useState } from 'react';

import { useParams, useRouter } from 'next/navigation';

import AppLayout from '@/components/AppLayout';

import AppointmentForm from '@/components/appointments/AppointmentForm';

import appointmentService from '@/services/appointmentService';

import {
  Appointment,
  UpdateAppointmentRequest,
} from '@/types/Appointment';

import { toast } from 'sonner';



function fixDate(date?: string) {

  if (!date) {

    return new Date()
      .toISOString()
      .split('T')[0];

  }


  if (date.startsWith('0001')) {

    return new Date()
      .toISOString()
      .split('T')[0];

  }


  return date.substring(0,10);

}




export default function EditAppointmentPage() {


  const params = useParams();

  const router = useRouter();


  const id = params.id as string;



  const [appointment,setAppointment] =
    useState<Appointment | null>(null);



  const [loading,setLoading] =
    useState(true);






  useEffect(()=>{

    loadAppointment();

  },[]);






  async function loadAppointment(){


    try{


      const data =
        await appointmentService
        .getAppointmentById(id);



      setAppointment(data);


    }
    catch(error){


      console.error(error);


      toast.error(
        'Failed to load appointment'
      );


    }
    finally{

      setLoading(false);

    }


  }








  async function handleUpdateAppointment(
    data:any
  ){


    try{


      const updateData:
      UpdateAppointmentRequest =
      {


        appointmentDate:
          fixDate(
            data.appointmentDate
          ),



        appointmentTime:
          data.appointmentTime.length === 5
          ?
          `${data.appointmentTime}:00`
          :
          data.appointmentTime,



        status:
          data.status,



        notes:
          data.notes ?? '',


      };





      console.log(
        "PUT DATA",
        updateData
      );



      await appointmentService
      .updateAppointment(
        id,
        updateData
      );





      toast.success(
        'Appointment updated successfully'
      );



      router.push(
        '/admin-dashboard/appointments'
      );



    }
    catch(error:any){


      console.error(
        error
      );


      toast.error(
        error?.response?.data?.message ??
        'Unable to update appointment'
      );


    }


  }







  if(loading){


    return (

      <AppLayout role="admin">

        <div className="py-20 text-center">

          Loading appointment...

        </div>

      </AppLayout>

    );

  }








  if(!appointment){


    return (

      <AppLayout role="admin">

        <div className="py-20 text-center">

          Appointment not found

        </div>

      </AppLayout>

    );


  }







  return (

    <AppLayout

      role="admin"


      breadcrumbs={[

        {
          label:'Dashboard',
          href:'/'
        },

        {
          label:'Appointments',
          href:'/admin-dashboard/appointments'
        },

        {
          label:'Edit Appointment'
        }

      ]}

    >




      <div className="mb-6">


        <h1 className="text-3xl font-bold">

          Edit Appointment

        </h1>



        <p className="text-slate-500">

          Update appointment information

        </p>



      </div>







      <AppointmentForm


        isEdit={true}



        initialValues={{



          patientId:

            appointment.patientId,



          doctorId:

            appointment.doctorId,



          appointmentDate:

            fixDate(
              appointment.appointmentDate
            ),



          appointmentTime:

            appointment.appointmentTime
            ?
            appointment.appointmentTime.substring(0,5)
            :
            '00:00',




          reason:

            appointment.reason ?? '',



          notes:

            appointment.notes ?? '',



          status:

            appointment.status,



        }}




        onSubmit={
          handleUpdateAppointment
        }


      />




    </AppLayout>

  );


}