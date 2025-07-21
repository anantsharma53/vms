from django.views import View
from .serializers import *
from django.http import JsonResponse
from rest_framework import viewsets
from rest_framework.views import APIView
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from django.core.paginator import Paginator
from rest_framework.response import Response
from django.shortcuts import get_object_or_404
from django.db.models import Sum
from decimal import Decimal
import json
from .models import *
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Count
from rest_framework.pagination import PageNumberPagination
from django.contrib.auth import update_session_auth_hash
from django.db.models import Q
from datetime import datetime
from django.utils import timezone
import requests
from django.conf import settings
from django.utils.html import escape

def send_email_with_resend(complaint, subject, message_html):
    try:
        department = Department.objects.get(id=complaint.category)
        department_name = department.name
    except:
        department_name = "Unknown Department"

    complaint_id = f"JH/JMT/{department_name}/{complaint.created_at.strftime('%d-%m-%Y')}/{complaint.id}"

    html_content = f"""
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
            <h2 style="color: #0066cc;">📩 Complaint Update Notification</h2>
            <p>Dear <strong>{escape(complaint.name)}</strong>,</p>
            {message_html}
            <p style="color: #444; font-size: 16px;">
                You can check your complaint status — 
                <a href="https://jamtaradistrict.in/complaint-status?id={complaint.id}" style="color: #007BFF; text-decoration: underline; font-weight: bold;">
                    Click here
                </a>.
            </p>
            <p style="margin-top: 30px;">Regards,<br><strong>District Office, Jamtara</strong></p>
            <hr style="margin: 30px 0;">
            <p style="font-size: 12px; color: #888;">
                This is an automated message from the Jamtara Complaint Portal. Please do not reply to this email.
            </p>
        </div>
    """

    requests.post(
        "https://api.resend.com/emails",
        headers={
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json"
        },
        json={
            "from": "Jamtara Complaints <noreply@jamtaradistrict.in>",
            "to": [complaint.email],
            "subject": subject,
            "html": html_content,
        }
    )

# def send_email_with_resend(complaint, subject, html_content):
#     url = "https://api.resend.com/emails"
#     headers = {
#         "Authorization": f"Bearer {settings.RESEND_API_KEY}",
#         "Content-Type": "application/json"
#     }
#     data = {
#         "from": "Jamtara Complaints <noreply@jamtara.gov.in>",
#         "to": [complaint.email],
#         "subject": subject,
#         "html": html_content
#     }
#     response = requests.post(url, json=data, headers=headers)
#     return response.json()


class SignUpView(APIView):
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.save()
            refresh = RefreshToken.for_user(user)
            return JsonResponse(
                {"refresh": str(refresh), "access": str(refresh.access_token)},
                status=status.HTTP_201_CREATED,
            )
        return JsonResponse(serializer.error, status.HTTP_400_BAD_REQUEST, safe=False)

class SignInView(APIView):
    def post(self, request):
        serializer = LoginSerializer(data=request.data)
        user_data = {}
        if serializer.is_valid():
            user = serializer.validated_data
            refresh = RefreshToken.for_user(user)
            
            # Fetch user's application information if it exists
            application = ApplicantInformation.objects.filter(user=user).first()
            has_applied = application is not None
            application_number = application.application_number if application else None
            
            user_data = {
                "id": user.id,
                "username": user.username,
                "panchyat": user.panchyat,
                "village": user.village,
                "email": user.email,
                "name": user.name,
                "mobile_number": user.mobile_number,
                "is_recptionstaff": user.is_recptionstaff,
                "is_candiate": user.is_candidate,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "has_applied": has_applied,  # Add has_applied status
                "application_number": application_number,  # Add application number if exists
                "department":user.department_id,
            }
            
            return JsonResponse(
                {
                    "user": user_data,
                    "refresh": str(refresh),
                    "access": str(refresh.access_token),
                },
                status=status.HTTP_201_CREATED,
            )
        return JsonResponse(serializer.errors, status=status.HTTP_400_BAD_REQUEST, safe=False)



class DepartmentListCreateAPIView(APIView):
    def get(self, request):
        departments = Department.objects.all()
        serializer = DepartmentSerializer(departments, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = DepartmentSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Department created.', 'data': serializer.data}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DepartmentDetailAPIView(APIView):
    def get(self, request, pk):
        department = get_object_or_404(Department, pk=pk)
        serializer = DepartmentSerializer(department)
        return Response(serializer.data)
    def put(self, request, pk):
        department = get_object_or_404(Department, pk=pk)
        serializer = DepartmentSerializer(department, data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Department updated.', 'data': serializer.data})
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def delete(self, request, pk):
        department = get_object_or_404(Department, pk=pk)
        department.delete()
        return Response({'message': 'Department deleted.'}, status=status.HTTP_204_NO_CONTENT)



class JobApplicationAPIView(APIView):
    # Only authenticated users can access this view
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        # Include the 'user' field in the data
        data = request.data.copy()
        data['user'] = request.user.id  # Associate the current user with the application

        # The user must now include 'application_number' in the request data
        serializer = JobApplicationSerializer(data=data)
        if serializer.is_valid():
            job_application = serializer.save()

            return Response({"application_number": job_application.application_number}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    




class ApplicantInformationView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        roll_number = request.query_params.get('roll_number')
        application_number = request.query_params.get('application_number')

        try:
            if roll_number:
                applicant_info = ApplicantInformation.objects.get(roll_number=roll_number)
            elif application_number:
                applicant_info = ApplicantInformation.objects.get(application_number=application_number)
            else:
                return Response({"detail": "Please provide either roll_number or application_number."}, status=status.HTTP_400_BAD_REQUEST)

            serializer = ApplicantInformationSerializer(applicant_info)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except ApplicantInformation.DoesNotExist:
            return Response({"detail": "Applicant information not found."}, status=status.HTTP_404_NOT_FOUND)
        
# Jharsewa Application Saving API       
class JharsewaApplicantAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure only authenticated users can access

    def post(self, request, *args, **kwargs):
        # Add the user ID to the request data
        data = request.data.copy()
        data['user'] = request.user.id  # Extract user ID from the token
        
        serializer = ApplicantInformationSerializer(data=data)

        if serializer.is_valid():
            applicant_info = serializer.save(user=request.user)  # Save with the user instance
            return Response(
                {
                    "message": "Application submitted successfully.",
                    "application_number": applicant_info.application_number,
                },
                status=status.HTTP_201_CREATED,
            )
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# Jharsewa Application Image uploding Saving API   
class ApplicantFileUploadAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, *args, **kwargs):
        application_number = request.data.get('application_number')
        user_id = request.user.id 

        # Validate application_number and user_id
        try:
            applicant = ApplicantInformation.objects.get(
                application_number=application_number, 
                user_id=user_id
            )
        except ApplicantInformation.DoesNotExist:
            return Response(
                {"error": "Applicant with the given application number and user ID does not exist."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Use the partial serializer to update fields
        serializer = ApplicantFileUploadSerializer(applicant, data=request.data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response({"message": "Files uploaded successfully.", "data": serializer.data}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
      



class ApplicantByPostAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, post):
        # Create a pagination instance
        paginator = PageNumberPagination()
        paginator.page_size = 1  # Default number of records per page

        # Optionally, adjust the page size if provided in the query parameters
        page_size = request.query_params.get('page_size')
        if page_size is not None:
            paginator.page_size = int(page_size)
        
        # Retrieve applicants filtered by post
        applicants = ApplicantInformation.objects.filter(post=post)
        
        # Paginate the applicants queryset
        page = paginator.paginate_queryset(applicants, request)
        
        if page is None:
            return Response({"detail": "Invalid page."}, status=400)
        
        serializer = ApplicantInformationSerializer(page, many=True)
        
        # Return paginated response with metadata
        return paginator.get_paginated_response(serializer.data)

    def post(self, request):
        """ Update applicant application_status and remarks """
        applicant_id = request.data.get("applicant_id")
        new_status = request.data.get("application_status")
        new_remarks = request.data.get("remarks")

        if not applicant_id or new_status is None:
            return Response({"error": "Applicant ID and application_status are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Get the applicant from the database
        applicant = get_object_or_404(ApplicantInformation, id=applicant_id)

        # Update fields
        applicant.application_status = new_status
        applicant.remarks = new_remarks
        applicant.save()

        return Response({"message": "Application status updated successfully!"}, status=status.HTTP_200_OK)

    
class UserInformationAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        try:
            # Fetching application details if the user has applied
            application = ApplicantInformation.objects.filter(user=user).first()
            application_data = None
            application_number = application.application_number if application else None
            
            if application:
                # Serialize application data
                application_data = ApplicantInformationSerializer(application).data

            # Fetching user details
            user_data = {
                "id": user.id,
                "name": user.name,
                "email": user.email,
                "mobile_number": user.mobile_number,
                "panchyat": user.panchyat,
                "village": user.village,
                "username": user.username,
                "is_candidate": user.is_candidate,
                "is_staff": user.is_staff,
                "is_superuser": user.is_superuser,
                "has_applied": application is not None,  # True if application exists
                "application_details": application_data,  # Include application details if exists
                "application_number": application_number,
                "department":user.department_id,
            }

            return Response(user_data, status=status.HTTP_200_OK)
        
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    def put(self, request):
        user = request.user
        try:
            # Extracting updated fields from the request data
            name = request.data.get('name', user.name)  # Default to current name if not provided
            email = request.data.get('email', user.email)
            mobile_number = request.data.get('mobile_number', getattr(user, 'mobile_number', ''))
            panchyat = request.data.get('panchyat', getattr(user, 'panchyat', ''))
            village = request.data.get('village', getattr(user, 'village', ''))
            username = request.data.get('username', user.username)
            
            user.name = name
            user.email = email
            user.username = username

            # For custom fields, we would need to ensure these fields are present
            setattr(user, 'mobile_number', mobile_number)
            setattr(user, 'panchyat', panchyat)
            setattr(user, 'village', village)
            # setattr(user, 'is_candidate', is_candidate)

            # Save the updated user
            user.save()

            # Handle staff and superuser permissions only if required
            # user.is_staff = is_staff
            # user.is_superuser = is_superuser
            user.save()

            return Response({"message": "User information updated successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class AllUserInformationAPIView(APIView):
    permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request):
        # Ensure the user making the request is a superuser
        if not request.user.is_superuser:
            return Response({"error": "You do not have permission to view this data."}, status=status.HTTP_403_FORBIDDEN)
        
        try:
            # Fetch all users from the User model
            users = User.objects.all()

            # List to store the serialized user data
            all_users_data = []

            for user in users:
                # Fetching application details if the user has applied
                application = ApplicantInformation.objects.filter(user=user).first()
                application_data = None
                application_number = application.application_number if application else None

                if application:
                    # Serialize application data
                    application_data = ApplicantInformationSerializer(application).data

                # Prepare user data
                user_data = {
                    "id": user.id,
                    "name": user.name,
                    "email": user.email,
                    "mobile_number": user.mobile_number,
                    "panchyat": user.panchyat,
                    "village": user.village,
                    "username": user.username,
                    "is_candidate": user.is_candidate,
                    "is_staff": user.is_staff,
                    "is_superuser": user.is_superuser,
                    "is_recptionstaff":user.is_recptionstaff,
                    "has_applied": application is not None,  # True if application exists
                    "application_details": application_data,  # Include application details if exists
                    "application_number": application_number,
                    "department":user.department_id,
                }

                # Append each user's data to the list
                all_users_data.append(user_data)

            return Response(all_users_data, status=status.HTTP_200_OK)

        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    def put(self, request, user_id):
        # Ensure the user making the request is a superuser
        if not request.user.is_superuser:
            return Response({"error": "You do not have permission to update this data."}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(id=user_id)
            data = request.data

            # Update user fields
            user.name = data.get("name", user.name)
            user.email = data.get("email", user.email)
            user.mobile_number = data.get("mobile_number", user.mobile_number)
            user.panchyat = data.get("panchyat", user.panchyat)
            user.village = data.get("village", user.village)
            user.username = data.get("username", user.username)
            user.is_candidate = data.get("is_candidate", user.is_candidate)
            user.is_staff = data.get("is_staff", user.is_staff)
            user.is_superuser = data.get("is_superuser", user.is_superuser)

            # Save the updated user
            user.save()

            return Response({"message": "User updated successfully"}, status=status.HTTP_200_OK)
        
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

    def delete(self, request, user_id):
        # Ensure the user making the request is a superuser
        if not request.user.is_superuser:
            return Response({"error": "You do not have permission to delete this data."}, status=status.HTTP_403_FORBIDDEN)

        try:
            user = User.objects.get(id=user_id)

            # Delete the user
            user.delete()

            return Response({"message": "User deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
        
        except User.DoesNotExist:
            return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)

class UpdatePasswordAPIView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        user = request.user  # Get the currently authenticated user
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        confirm_password = request.data.get('confirm_password')

        # Check if all fields are provided
        if not current_password or not new_password or not confirm_password:
            return Response(
                {'error': 'All fields (current_password, new_password, confirm_password) are required.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the new password and confirm password match
        if new_password != confirm_password:
            return Response(
                {'error': 'New password and confirm password do not match.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check if the current password is correct
        if not user.check_password(current_password):
            return Response(
                {'error': 'Current password is incorrect.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Check password strength if needed (optional)
        if len(new_password) < 8:  # Example: minimum password length
            return Response(
                {'error': 'Password should be at least 8 characters long.'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # Set the new password
        user.set_password(new_password)

        try:
            user.save()

            # Update session after password change (to keep user logged in)
            update_session_auth_hash(request, user)

            return Response({'message': 'Password updated successfully.'}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)


class ComplaintView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = [MultiPartParser, FormParser]

    def post(self, request, *args, **kwargs):
        images_data = request.FILES.getlist('images')
        data = request.data.copy()
        data['user'] = request.user.id

        serializer = ComplaintSerializer(data=data)
        if serializer.is_valid():
            complaint = serializer.save()

            for image_file in images_data:
                ComplaintImage.objects.create(complaint=complaint, image=image_file)

            # ✅ Send email via Resend
            self.send_email(complaint)

            return Response(serializer.data, status=status.HTTP_201_CREATED)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    def send_email(self, complaint):
        try:
            department = Department.objects.get(id=complaint.category)
            department_name = department.name
        except Department.DoesNotExist:
            department_name = "Unknown Department"
        url = "https://api.resend.com/emails"
        headers = {
            "Authorization": f"Bearer {settings.RESEND_API_KEY}",
            "Content-Type": "application/json"
        }
        data = {
                "from": "Jamtara Complaints <noreply@jamtaradistrict.in>",
                "to": [complaint.email],
                "subject": "✅ Your Complaint Has Been Registered",
                "html": f"""
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 8px;">
                    <h2 style="color: #0066cc;">📩 Complaint Acknowledgement</h2>
                    <p>Dear <strong>{complaint.name}</strong>,</p>
                    
                    <p>Thank you for submitting your complaint. Below are the details:</p>

                    <table style="width: 100%; border-collapse: collapse; margin: 20px 0;">
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">🆔 Complaint ID:</td>
                            <td style="padding: 8px;">JH/JMT/{department_name}/{complaint.created_at}/{complaint.id}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">🏢 Department:</td>
                            <td style="padding: 8px;">{department_name}</td>
                        </tr>
                        <tr>
                            <td style="padding: 8px; font-weight: bold;">📝 Details:</td>
                            <td style="padding: 8px;">{complaint.complaint_text}</td>
                        </tr>
                    </table>

                    <p style="color: #444;">📅 We will take appropriate action as soon as possible and notify you of any updates.</p>
                    <p style="color: #444; font-size: 16px;">
                        Check your complaint's current status — 
                            <a href="#" style="color: #007BFF; text-decoration: underline; font-weight: bold;">
                            Click here
                            </a>.
                    </p>
                    <p style="margin-top: 30px;">Regards,<br><strong>District Office, Jamtara</strong></p>

                    <hr style="margin: 30px 0;">
                    <p style="font-size: 12px; color: #888;">
                        This is an automated message from Jamtara Complaint Portal. Please do not reply to this email.
                    </p>
                </div>
                """
            }

        try:
            requests.post(url, json=data, headers=headers)
        except requests.RequestException as e:
            print("Email sending failed:", e)

class FeedbackView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request, complaint_id):
        # Get the complaint object
        try:
            complaint = Complaint.objects.get(id=complaint_id)
        except Complaint.DoesNotExist:
            return Response({"detail": "Complaint not found."}, status=status.HTTP_404_NOT_FOUND)

        # Validate and parse the feedback from the request body
        serializer = FeedbackSerializer(data=request.data)
        if serializer.is_valid():
            feedback = serializer.validated_data['feedback']
            # Update the complaint with the feedback
            complaint.feedback = feedback
            complaint.save()

            return Response({"detail": "Feedback submitted successfully."}, status=status.HTTP_200_OK)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class StandardResultsPagination(PageNumberPagination):
    page_size = 10  # Default items per page
    page_size_query_param = 'page_size'  # Allow client to set page size
    max_page_size = 100  # Max limit for page size

class ComplaintListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        user = request.user
        query_params = request.query_params

        # Base query for complaints
        if user.is_superuser or getattr(user, "is_recptionstaff", False):
            # Superusers or reception staff see all complaints
            complaints = Complaint.objects.select_related('user').prefetch_related('images').all()

        elif user.is_staff:
            # Staff can only see unresolved complaints for their department
            if not user.department_id:
                return Response({"error": "Staff user does not have a department assigned."}, status=400)
            complaints = Complaint.objects.select_related('user').prefetch_related('images').filter(
                accept_remarks__isnull=True,
                category=user.department_id  # 🔐 Only complaints related to their department
            )

        else:
            # Normal users see only their own complaints
            complaints = Complaint.objects.filter(user=user).prefetch_related('images')

        # Apply filters
        complaint_id = query_params.get('complaint_id')
        category = query_params.get('category')
        start_date = query_params.get('start_date')
        end_date = query_params.get('end_date')
        status = query_params.get('status')

        if complaint_id:
            complaints = complaints.filter(id=complaint_id)

        if category:
            complaints = complaints.filter(category=category)

        if start_date:
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                start = timezone.make_aware(start, timezone.utc)
                complaints = complaints.filter(created_at__gte=start)
            except ValueError:
                return Response({"error": "Invalid start_date format. Use YYYY-MM-DD."}, status=400)

        if end_date:
            try:
                end = datetime.strptime(end_date, "%Y-%m-%d").replace(hour=23, minute=59, second=59, microsecond=999999)
                end = timezone.make_aware(end, timezone.utc)
                complaints = complaints.filter(created_at__lte=end)
            except ValueError:
                return Response({"error": "Invalid end_date format. Use YYYY-MM-DD."}, status=400)
        if status:
            complaints = complaints.filter(status=status)
        # Sort and paginate
        complaints = complaints.order_by("-created_at")
        paginator = StandardResultsPagination()
        result_page = paginator.paginate_queryset(complaints, request)
        serializer = ComplaintSerializer(result_page, many=True)

        return paginator.get_paginated_response(serializer.data)



class ComplaintDetailView(APIView):
    permission_classes=[IsAuthenticated]
    def get(self, request, pk, *args, **kwargs):
        # Retrieve the complaint for the authenticated user
        complaint = get_object_or_404(Complaint, pk=pk, user=request.user)
        serializer = ComplaintSerializer(complaint)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
    def delete(self, request, pk, *args, **kwargs):
        complaint = get_object_or_404(Complaint, pk=pk, user=request.user)
        complaint.delete()
        return Response({"message": "Complaint deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

class ComplaintResolutionView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, complaint_id, *args, **kwargs):
        # Fetch the complaint by ID
        complaint = get_object_or_404(Complaint, pk=complaint_id)

        # Ensure the user is either the owner or an admin
        if complaint.user == request.user or request.user.is_staff or request.user.is_superuser or request.user.is_recptionstaff:
            resolution = complaint.resolution
            if resolution:
                return Response(
                    {"complaint_id": complaint.id, "resolution": resolution},
                    status=status.HTTP_200_OK
                )
            else:
                return Response(

                    {"error": "Resolution is not available for this complaint."},
                    status=status.HTTP_404_NOT_FOUND
                )
        else:
            return Response(
                {"error": "You do not have permission to view this complaint resolution."},
                status=status.HTTP_403_FORBIDDEN
            )
class SolvedComplaintsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, *args, **kwargs):
        complaint_id = request.GET.get("complaint_id")
        category = request.GET.get("category")
        status = request.GET.get("status")
        start_date = request.GET.get("start_date")
        end_date = request.GET.get("end_date")

        queryset = Complaint.objects.filter(
            Q(status="accepted") | Q(status="disposed")
        ).order_by("-created_at")

        if complaint_id:
            queryset = queryset.filter(id=complaint_id)

        if category:
            queryset = queryset.filter(category=category)

        if status in ["accepted", "disposed"]:
            queryset = queryset.filter(status=status)

        if start_date:
            try:
                start = datetime.strptime(start_date, "%Y-%m-%d")
                queryset = queryset.filter(created_at__gte=start)
            except ValueError:
                pass

        if end_date:
            try:
                end = datetime.strptime(end_date, "%Y-%m-%d")
                queryset = queryset.filter(created_at__lte=end)
            except ValueError:
                pass

        serializer = ComplaintSerializer(queryset, many=True, context={"request": request})
        return Response({"results": serializer.data})




class AdminComplaintView(APIView):
    permission_classes = [IsAuthenticated, IsAdminUser]

    def get(self, request):
        # Fetch all complaints
        complaints = Complaint.objects.prefetch_related('images').all()
        serializer = ComplaintSerializer(complaints, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def patch(self, request, pk):
        try:
            complaint = Complaint.objects.get(pk=pk)
            resolution = request.data.get("resolution")
            if resolution:
                complaint.resolution = resolution
                complaint.save()
                return Response({"message": "Resolution added successfully"}, status=status.HTTP_200_OK)
            return Response({"error": "Resolution is required"}, status=status.HTTP_400_BAD_REQUEST)
        except Complaint.DoesNotExist:
            return Response({"error": "Complaint not found"}, status=status.HTTP_404_NOT_FOUND)



class SearchAdmitCardView(APIView):
    def post(self, request):
        applicationNumber = request.data.get('applicationNumber')
        dob = request.data.get('dob')
        print("Request data:", request.data)
        print( applicationNumber)
        print(dob)
        # Validate the input
        if not applicationNumber or not dob:
            return Response({'error': 'Application Number and date of birth are required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Find the AdmitCard by application number and dob
        admit_card = get_object_or_404(ApplicantInformation, application_number=applicationNumber, dob=dob)
        # Serialize the AdmitCard data
        serializer = AdmitCardSerializer(admit_card)

        return Response(serializer.data, status=status.HTTP_200_OK)

class ComplaintCountAPIView(APIView):
    # permission_classes = [IsAuthenticated]  # Ensure the user is authenticated

    def get(self, request, *args, **kwargs):
        user = request.user

        # Check if the user is a superuser or staff
        if user.is_staff or user.is_superuser or user.is_recptionstaff:
            # Staff or superusers see all complaints
            complaints = Complaint.objects.all()
        elif hasattr(user, 'is_candidate') and user.is_candidate:
            # Candidates see only their related complaints
            complaints = Complaint.objects.filter(user=user)
        else:
            return Response(
                {"detail": "You do not have permission to view this data."},
                status=status.HTTP_403_FORBIDDEN
            )

        # Get the total number of complaints
        total_complaints = complaints.count()

        # Complaints per category
        complaints_per_category = complaints.values('category').annotate(count=Count('id'))

        # Resolved complaints per category
        resolved_complaints_per_category = complaints.filter(resolution__isnull=False).values('category').annotate(count=Count('id'))

        # Pending complaints per category
        pending_complaints_per_category = complaints.filter(resolution__isnull=True).values('category').annotate(count=Count('id'))

        # Format the response
        response_data = {
            "total_complaints": total_complaints,
            "complaints_per_category": {item['category']: item['count'] for item in complaints_per_category},
            "resolved_complaints_per_category": {item['category']: item['count'] for item in resolved_complaints_per_category},
            "pending_complaints_per_category": {item['category']: item['count'] for item in pending_complaints_per_category},
        }

        return Response(response_data, status=status.HTTP_200_OK)




class ComplaintAcceptView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        complaint = get_object_or_404(Complaint, pk=pk)
        if request.user.department_id != complaint.category:
            return Response({"error": "Unauthorized"}, status=403)

        complaint.status = 'accepted'
        complaint.accept_remarks = request.data.get('remarks')
        complaint.save()

        ComplaintAction.objects.create(
            complaint=complaint,
            performed_by=request.user,
            action="accepted",
            remarks=request.data.get('remarks')
        )
        send_email_with_resend(
            complaint,
            "✅ Complaint Accepted",
            f"<p>Your complaint has been <strong>accepted</strong> by the department.</p><p><em>Remarks:</em> {escape(request.data.get('remarks'))}</p>"
        )

        return Response({"message": "Complaint accepted and accept remarks added."})


class ComplaintRejectView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        complaint = get_object_or_404(Complaint, pk=pk)
        complaint.status = 'admin_review'
        complaint.rejection_remarks = request.data.get('remarks')
        complaint.save()

        ComplaintAction.objects.create(
            complaint=complaint,
            performed_by=request.user,
            action="rejected",
            remarks=request.data.get('remarks')
        )
        send_email_with_resend(
            complaint,
            "⚠️ Complaint Sent for Admin Review",
            f"<p>Your complaint has been <strong>sent to the district administrator</strong> for reassignment.</p><p><em>Remarks:</em> {escape(request.data.get('remarks'))}</p>"
        )

        return Response({"message": "Complaint sent to admin for reassignment."})


class ComplaintForwardView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        complaint = get_object_or_404(Complaint, pk=pk)
        to_dept = get_object_or_404(Department, pk=request.data.get("to_department"))

        complaint.status = 'forwarded'
        complaint.forwarded_to = to_dept
        complaint.forwarded_by = request.user
        complaint.forward_remarks = request.data.get("remarks")
        complaint.save()

        ComplaintAction.objects.create(
            complaint=complaint,
            performed_by=request.user,
            action="forwarded",
            to_department=to_dept,
            remarks=request.data.get("remarks")
        )
        send_email_with_resend(
            complaint,
            "➡️ Complaint Forwarded",
            f"<p>Your complaint has been <strong>forwarded</strong> to the concerned department: <strong>{to_dept.name}</strong>.</p><p><em>Remarks:</em> {escape(request.data.get('remarks'))}</p>"
        )

        return Response({"message": "Complaint forwarded to subsidiary office."})

class ComplaintResolutionAddView(APIView):
    permission_classes = [IsAuthenticated]

    def patch(self, request, pk):
        complaint = get_object_or_404(Complaint, pk=pk)
        if request.user.department_id != complaint.category:
            return Response({"error": "Unauthorized"}, status=403)

        complaint.status = 'accepted'
        complaint.resolution = request.data.get('remarks')
        complaint.save()

        ComplaintAction.objects.create(
            complaint=complaint,
            performed_by=request.user,
            action="accepted",
            remarks=request.data.get('remarks')
        )
        send_email_with_resend(
            complaint,
            "✅ Complaint Resolved",
            f"<p>Your complaint has been <strong>resolved</strong>.</p><p><em>Resolution:</em> {escape(request.data.get('remarks'))}</p>"
        )

        return Response({"message": "Complaint Resolution added."})

class ComplaintDisposeView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        complaint = get_object_or_404(Complaint, pk=pk)
        if not request.user.is_superuser:
            return Response({"error": "Only admin can dispose complaint."}, status=403)

        complaint.status = 'disposed'
        complaint.save()

        ComplaintAction.objects.create(
            complaint=complaint,
            performed_by=request.user,
            action="disposed",
            remarks="Marked as disposed"
        )
        send_email_with_resend(
            complaint,
            "🗃️ Complaint Disposed",
            "<p>Your complaint has been <strong>disposed</strong> by the district administrator.</p>"
        )

        return Response({"message": "Complaint marked as disposed by admin."})
class ComplaintReassignByAdminView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, pk):
        if not request.user.is_superuser:
            return Response({"error": "Unauthorized"}, status=403)

        complaint = get_object_or_404(Complaint, pk=pk)
        new_dept = get_object_or_404(Department, pk=request.data.get("to_department"))

        complaint.department = new_dept
        complaint.category=new_dept.id
        complaint.resolution = None  # Reset resolution when reassigning
        complaint.status = "pending"
        complaint.forward_remarks = request.data.get("remarks", "")
        complaint.save()

        ComplaintAction.objects.create(
            complaint=complaint,
            performed_by=request.user,
            action="reassigned by admin",
            remarks=request.data.get("remarks"),
            to_department=new_dept
        )
        send_email_with_resend(
            complaint,
            "🔄 Complaint Reassigned",
            f"<p>Your complaint has been <strong>reassigned</strong> to a new department: <strong>{new_dept.name}</strong>.</p><p><em>Remarks:</em> {escape(request.data.get('remarks'))}</p>"
        )


        return Response({"message": "Complaint reassigned to another department."})