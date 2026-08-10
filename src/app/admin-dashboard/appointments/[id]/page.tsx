'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';

import { ArrowLeft, Calendar, Clock, User, Stethoscope } from 'lucide-react';
import { toast } from 'sonner';

import AppLayout from '@/components/AppLayout';

import appointmentService from '@/services/appointmentService';

import {
    Appointment,
} from '@/types/Appointment';

import AppointmentStatusBadge from '@/components/appointments/AppointmentStatusBadge';



export default function AppointmentDetailsPage() {


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

            setLoading(true);


            const response =
                await appointmentService.getAppointmentById(
                    id
                );


            setAppointment(response);


        }
        catch(error){

            console.error(error);

            toast.error(
                'Unable to load appointment details'
            );

        }
        finally{

            setLoading(false);

        }

    }




    if(loading){

        return (

            <AppLayout role="admin">

                <div className="py-20 text-center text-slate-500">

                    Loading appointment details...

                </div>

            </AppLayout>

        );

    }




    if(!appointment){

        return (

            <AppLayout role="admin">

                <div className="py-20 text-center">

                    Appointment not found.

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
label:'Details'
}
]}
>


<div className="mb-6 flex items-center justify-between">


<div>

<Link
href="/admin-dashboard/appointments"
className="flex items-center gap-2 text-sm text-slate-500 hover:text-cyan-700"
>

<ArrowLeft size={16}/>

Back to appointments

</Link>



<h1 className="mt-4 text-3xl font-bold">

Appointment Details

</h1>


<p className="text-slate-500">

View complete appointment information

</p>


</div>



<AppointmentStatusBadge
status={appointment.status}
/>


</div>





<div className="grid gap-6 md:grid-cols-2">



{/* Appointment Information */}

<div className="rounded-xl border bg-white p-6 shadow-sm">


<h2 className="mb-5 text-lg font-semibold">

Appointment Information

</h2>



<div className="space-y-4">


<div>

<p className="text-sm text-slate-500">

Appointment Number

</p>


<p className="font-semibold">

{appointment.appointmentNumber}

</p>

</div>





<div className="flex gap-3">

<Calendar className="text-cyan-700"/>

<div>

<p className="text-sm text-slate-500">

Date

</p>


<p>

{appointment.appointmentDate}

</p>


</div>


</div>






<div className="flex gap-3">

<Clock className="text-cyan-700"/>

<div>

<p className="text-sm text-slate-500">

Time

</p>


<p>

{appointment.appointmentTime}

</p>


</div>

</div>




<div>

<p className="text-sm text-slate-500">

Department

</p>


<p>

{appointment.department ??
'Not Assigned'}

</p>

</div>



</div>


</div>







{/* Patient Doctor Information */}

<div className="rounded-xl border bg-white p-6 shadow-sm">


<h2 className="mb-5 text-lg font-semibold">

Patient & Doctor

</h2>




<div className="space-y-5">



<div className="flex gap-3">

<User
className="text-cyan-700"
/>


<div>

<p className="text-sm text-slate-500">

Patient

</p>


<p className="font-medium">

{appointment.patientName}

</p>


<p className="text-sm text-slate-500">

{appointment.patientId}

</p>


</div>

</div>







<div className="flex gap-3">

<Stethoscope
className="text-cyan-700"
/>


<div>

<p className="text-sm text-slate-500">

Doctor

</p>


<p className="font-medium">

{appointment.doctorName}

</p>


<p className="text-sm text-slate-500">

{appointment.doctorId}

</p>


</div>


</div>




</div>



</div>





</div>







{/* Reason Notes */}


<div className="mt-6 rounded-xl border bg-white p-6 shadow-sm">


<h2 className="mb-4 text-lg font-semibold">

Additional Information

</h2>



<div className="space-y-4">


<div>

<p className="text-sm text-slate-500">

Reason

</p>


<p>

{appointment.reason}

</p>


</div>



<div>

<p className="text-sm text-slate-500">

Notes

</p>


<p>

{appointment.notes ??
'No notes available'}

</p>


</div>



</div>


</div>




</AppLayout>

    );

}