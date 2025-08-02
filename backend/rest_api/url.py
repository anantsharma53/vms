from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from .views import ( SignUpView, SignInView, JobApplicationAPIView, ApplicantFileUploadAPIView,ApplicantByPostAPIView,ComplaintDetailView,ComplaintListView,JharsewaApplicantAPIView,ApplicantByPostAPIView,
                    AllUserInformationAPIView,UserInformationAPIView,ComplaintView,FeedbackView,UpdatePasswordAPIView,AdminComplaintView,SearchAdmitCardView,ComplaintCountAPIView,ComplaintResolutionView,ApplicantInformationView
                    ,DepartmentListCreateAPIView,DepartmentDetailAPIView,ComplaintAcceptView,ComplaintRejectView,ComplaintForwardView,ComplaintDisposeView,ComplaintReassignByAdminView,
                    SolvedComplaintsView,ComplaintResolutionAddView,RequestPasswordResetView,ResetPasswordConfirmView,generate_captcha)


urlpatterns = [
    path('signup/', SignUpView.as_view(), name='signup'),
    path('signin/', SignInView.as_view(), name='signin'),
    path('request-password-reset/', RequestPasswordResetView.as_view(), name='request-password-reset'),
    path('reset-password/<uidb64>/<token>/', ResetPasswordConfirmView.as_view(), name='reset-password-confirm'),
    path('departments/', DepartmentListCreateAPIView.as_view(), name='department-list-create'),
    path('departments/<int:pk>/', DepartmentDetailAPIView.as_view(), name='department-detail'),
    path('job-application/', JobApplicationAPIView.as_view(), name='job-application'),
    path('applicant-information/', UserInformationAPIView.as_view(), name='applicant-information'),
    path('users/', AllUserInformationAPIView.as_view(), name='all_users_information'),  # GET method
    path('users/<int:user_id>/', AllUserInformationAPIView.as_view(), name='user_update_delete'),  # PUT and DELETE methods
    path('update-password/', UpdatePasswordAPIView.as_view(), name='update-password'),
    path('complaints/', ComplaintView.as_view(), name='complaint-create'),
    path('complaintsview/', ComplaintListView.as_view(), name='complaints-list'),
    path('complaintsdetailview/<int:pk>/', ComplaintDetailView.as_view(), name='complaints-detail'),
    path('complaint-resolution/<int:complaint_id>/', ComplaintResolutionView.as_view(), name='complaint-resolution'),
    path('solvedcomplaintsview/', SolvedComplaintsView.as_view(), name='solved-complaints'),
    path('admincomplaints/', AdminComplaintView.as_view(), name='admin-complaints'),
    path('admincomplaints/<int:pk>/', AdminComplaintView.as_view(), name='admin-complaint-resolve'),
    path('vlefeedback/<int:complaint_id>/', FeedbackView.as_view(), name='submit-feedback'),
    path('jharsewa-applicants/', JharsewaApplicantAPIView.as_view(), name='jharsewa-applicants'),
    # path('jharsewa-applicants/<int:pk>/', JharsewaApplicantAPIView.as_view(), name='jharsewa-applicant-detail'),
    # path('applicant-information/<int:pk>/', ApplicantInformationView.as_view(), name='applicant-information'),
    path('applicantjharsewa/upload-files/', ApplicantFileUploadAPIView.as_view(), name='jharsewa-upload-files'),
    path('applicants/by_post/<str:post>/', ApplicantByPostAPIView.as_view(), name='applicant_by_post_api'),
    path('applicants/update_status/', ApplicantByPostAPIView.as_view(), name='update_applicant_status_api'),  # New endpoint for updating status
    path('user-information/', UserInformationAPIView.as_view(), name='applicant-information-detail'),
    path('searchAdmitCard/', SearchAdmitCardView.as_view(), name='search_admit_card'),
    path('complaint/count/', ComplaintCountAPIView.as_view(), name='complaint-count'),
    path('complaint/<int:pk>/accept/', ComplaintAcceptView.as_view(), name='complaint-accept'),
    path('complaint/<int:pk>/reject/', ComplaintRejectView.as_view(), name='complaint-reject'),
    path('complaint/<int:pk>/forward/', ComplaintForwardView.as_view(), name='complaint-forward'),
    path('complaint/<int:pk>/resolve/', ComplaintResolutionAddView.as_view(), name='complaint-resolve'),
    path('complaint/<int:pk>/dispose/', ComplaintDisposeView.as_view(), name='complaint-dispose'),
    path('complaint/<int:pk>/reassign/', ComplaintReassignByAdminView.as_view(), name='complaint-reassign'),
    path('generate-captcha/', generate_captcha),
    # Add other URL patterns as needed
  
]+ static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
