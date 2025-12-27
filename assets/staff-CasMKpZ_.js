import{d as s,r as c}from"./index-D9lviF5g.js";const f=async e=>{try{const{data:r,error:o}=await s.from("employees").select("*").eq("user_id",e).eq("status","active").single();if(o)throw o;return{data:r,error:null}}catch(r){return{data:null,error:r.message}}},w=async(e,r={})=>{try{let o=s.from("employees").select(`
        *,
        user:users!user_id(email, full_name, phone, avatar_url),
        created_by_user:users!created_by(email, full_name),
        updated_by_user:users!updated_by(email, full_name),
        employee_services(
          id,
          service_id,
          commission_rate,
          services(id, name, duration_minutes, price)
        )
      `).eq("business_id",e).neq("role",c.business_owner).order("created_at",{ascending:!1});r.status&&r.status!=="all"&&(o=o.eq("status",r.status)),r.role&&r.role!=="all"&&(o=o.eq("role",r.role));const{data:t,error:n}=await o;if(n)throw n;return{data:t,error:null}}catch(o){return{data:null,error:o.message}}},y=async e=>{try{const{data:r,error:o}=await s.from("employees").select(`
        *,
        user:users!user_id(email, full_name, phone, avatar_url),
        created_by_user:users!created_by(email, full_name),
        updated_by_user:users!updated_by(email, full_name),
        employee_services(
          id,
          service_id,
          commission_rate,
          services(id, name, duration_minutes, price)
        )
      `).eq("id",e).single();if(o)throw o;return{data:r,error:null}}catch(r){return{data:null,error:r.message}}},v=async e=>{try{if(!e.email||!e.first_name||!e.last_name)throw new Error("Email, first name, and last name are required");if(!e.business_id)throw new Error("Business ID is required");if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.email))throw new Error("Invalid email format");const{data:o}=await s.from("businesses").select("name").eq("id",e.business_id).single(),{data:t,error:n}=await s.functions.invoke("invite-staff",{body:{business_id:e.business_id,email:e.email,first_name:e.first_name,last_name:e.last_name,phone:e.phone,role:e.role,commission_rate:e.commission_rate||10,working_hours:e.working_hours||{},service_ids:e.service_ids||[],is_available_for_booking:e.is_available_for_booking!==!1,businessName:(o==null?void 0:o.name)||"Your Business",lang:"pl"}});return n?(console.error("Network error calling edge function:",n),{data:null,error:n.message||"Network error - failed to reach server",errorCode:"GENERIC_ERROR"}):!t||!t.success?{data:null,error:(t==null?void 0:t.error)||"Failed to send invitation",errorCode:(t==null?void 0:t.errorCode)||"GENERIC_ERROR"}:{data:{id:t.employeeId,invitation_token:t.invitationToken},error:null,errorCode:null}}catch(r){return{data:null,error:r.message,errorCode:"GENERIC_ERROR"}}},E=async(e,r)=>{try{if(!e)throw new Error("Staff ID is required");const o={...r,updated_by:r.updated_by||null,updated_at:new Date().toISOString()};delete o.service_ids,delete o.id,delete o.created_at,delete o.created_by,delete o.business_id;const{data:t,error:n}=await s.from("employees").update(o).eq("id",e).select(`
        *,
        employee_services(
          id,
          service_id,
          commission_rate,
          services(id, name, duration_minutes, price)
        )
      `).single();if(n)return{data:null,error:`Failed to update employee: ${n.message}`,errorCode:"FAILED_TO_UPDATE_EMPLOYEE"};if(r.service_ids!==void 0){const{error:a}=await _(e,r.service_ids);if(a)return{data:null,error:`Employee updated but service update failed: ${a}`,errorCode:"SERVICE_UPDATE_FAILED"}}return{data:t,error:null,errorCode:null}}catch(o){return{data:null,error:o.message,errorCode:"GENERIC_ERROR"}}},g=async e=>{try{if(!e)throw new Error("Staff ID is required");const{data:r,error:o}=await s.from("appointments").select("id").eq("employee_id",e).limit(1);if(o&&console.warn("Could not check appointments:",o),r&&r.length>0)throw new Error("Cannot delete staff member with existing appointments. Please deactivate instead.");const{error:t}=await s.from("employees").delete().eq("id",e);if(t)throw new Error(`Failed to delete employee: ${t.message}`);return{error:null}}catch(r){return{error:r.message}}},m=async(e,r)=>{try{if(!e||!r||r.length===0)return{data:[],error:null};const o=r.map(a=>({employee_id:e,service_id:a,commission_rate:null})),{data:t,error:n}=await s.from("employee_services").insert(o).select();if(n)throw n;return{data:t,error:null}}catch(o){return{data:null,error:o.message}}},_=async(e,r)=>{try{if(!e)throw new Error("Employee ID is required");const{error:o}=await s.from("employee_services").delete().eq("employee_id",e);if(o)throw o;if(r&&r.length>0){const{data:t,error:n}=await m(e,r);if(n)throw n;return{data:t,error:null}}return{data:[],error:null}}catch(o){return{data:null,error:o.message}}},h=async e=>{try{if(!e)return{data:null,error:"Invitation token is required",errorCode:"INVITATION_TOKEN_REQUIRED"};const{data:r,error:o}=await s.from("employees").select("id, first_name, last_name, email, invitation_expires_at, businesses(name)").eq("invitation_token",e).single();return o||!r?{data:null,error:"Invalid or expired invitation link",errorCode:"INVALID_INVITATION_TOKEN"}:new Date(r.invitation_expires_at)<new Date?{data:null,error:"This invitation has expired. Please contact your manager for a new invitation.",errorCode:"INVITATION_EXPIRED"}:{data:r,error:null,errorCode:null}}catch(r){return{data:null,error:r.message,errorCode:"GENERIC_ERROR"}}},b=async(e,r,o,t,n)=>{try{if(!e||!r||!o)throw new Error("Invitation token, email, and password are required");if(!t||!n)throw new Error("First name and last name are required");const{data:a,error:i}=await s.functions.invoke("accept-invitation",{body:{invitation_token:e,email:r,password:o,first_name:t,last_name:n}});return console.log("Response from accept-invitation:",{data:a,error:i}),i?(console.error("Network error calling edge function:",i),{data:null,error:i.message||"Network error - failed to reach server",errorCode:"NETWORK_ERROR"}):!a||!a.success?{data:null,error:(a==null?void 0:a.error)||"Failed to create account",errorCode:(a==null?void 0:a.errorCode)||"GENERIC_ERROR"}:{data:{success:!0},error:null,errorCode:null}}catch(a){return{data:null,error:a.message,errorCode:"GENERIC_ERROR"}}},R=async e=>{var r,o;try{if(!e)throw new Error("Staff ID is required");const{data:t,error:n}=await s.from("employees").select(`
        *,
        businesses(name),
        employee_services(service_id)
      `).eq("id",e).single();if(n||!t)throw new Error("Staff member not found");if(t.status!=="invited")throw new Error("Can only resend invitation to staff with invited status");const{error:a}=await s.from("employees").delete().eq("id",e);if(a)throw a;const{data:i,error:d}=await s.functions.invoke("invite-staff",{body:{business_id:t.business_id,email:t.email,first_name:t.first_name,last_name:t.last_name,phone:t.phone,role:t.role,commission_rate:t.commission_rate,working_hours:t.working_hours,service_ids:((r=t.employee_services)==null?void 0:r.map(l=>l.service_id))||[],is_available_for_booking:t.is_available_for_booking,businessName:((o=t.businesses)==null?void 0:o.name)||"Your Business",lang:"pl"}});if(d)throw new Error(d.message||"Failed to resend invitation");if(!i.success)throw new Error(i.error||"Failed to resend invitation");return{success:!0,error:null}}catch(t){return{success:!1,error:t.message}}},C=async(e,r,o)=>{try{const{data:t,error:n}=await s.from("appointments").select(`
        *,
        clients(first_name, last_name, phone),
        services(name, duration_minutes)
      `).eq("employee_id",e).gte("appointment_date",r).lte("appointment_date",o).order("appointment_date",{ascending:!0}).order("start_time",{ascending:!0});if(n)throw n;return{data:t,error:null}}catch(t){return{data:null,error:t.message}}},q=async(e,r,o)=>{try{const{data:t,error:n}=await s.from("appointments").select(`
        id,
        status,
        total_amount,
        appointment_date
      `).eq("employee_id",e).gte("appointment_date",r).lte("appointment_date",o);if(n)throw n;const a=t.length,i=t.filter(l=>l.status==="completed").length,d=t.reduce((l,u)=>u.status==="completed"?l+parseFloat(u.total_amount):l,0);return{data:{total_appointments:a,completed_appointments:i,total_revenue:d,completion_rate:a>0?i/a*100:0},error:null}}catch(t){return{data:null,error:t.message}}};export{b as a,f as b,v as c,y as d,C as e,q as f,w as g,g as h,R as r,E as u,h as v};
