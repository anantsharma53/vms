from django.db import models
from django.contrib.auth.models import BaseUserManager, AbstractBaseUser

class UserManager(BaseUserManager):
    def create_user(self, username, password, **extra_fields):
        if not username:
            raise ValueError("Username should be provided")
        user = self.model(username=username, **extra_fields)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, username, password, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(username, password, **extra_fields)

class Department(models.Model):
    name = models.CharField(max_length=100, unique=True)
    contactNumber = models.CharField(max_length=15)
    email = models.EmailField(blank=True, null=True)
    address = models.TextField()
    description = models.TextField(blank=True)

class User(AbstractBaseUser):
    id = models.AutoField(primary_key=True)
    name = models.CharField(max_length=255)
    panchyat = models.CharField(max_length=255)
    village = models.CharField(max_length=255)
    username = models.CharField(max_length=30, unique=True)
    email = models.EmailField(max_length=100, unique=True)
    mobile_number = models.CharField(max_length=15)
    password = models.CharField(max_length=100)
    is_candidate = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    is_recptionstaff = models.BooleanField(default=False)
    is_superuser = models.BooleanField(default=False)
    is_jantadarbar= models.BooleanField(default=False)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    

    USERNAME_FIELD = 'username'
    objects = UserManager()

    def has_perm(self, perm, obj=None):
        return self.is_superuser

    def has_module_perms(self, app_label):
        return self.is_superuser


class ApplicantInformation(models.Model):
    # 1. User details
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    # 2. Candidate Details
    post = models.CharField(max_length=255)
    application_number = models.CharField(max_length=255, unique=True, blank=True, null=True)
    csc_id=models.CharField(max_length=12, unique=True)
    applicantName = models.CharField(max_length=255)
    fatherName = models.CharField(max_length=255)
    gender = models.CharField(max_length=10)
    dob = models.DateField()
    village = models.CharField(max_length=255)
    panchyat = models.CharField(max_length=255)
    post_office = models.CharField(max_length=255)
    police_station = models.CharField(max_length=255)
    circle = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    pin_code = models.CharField(max_length=6)
    correspondentAddress = models.TextField()
    mobileNumber = models.CharField(max_length=15)
    aadhaar_number = models.CharField(max_length=12)
    pan=models.CharField(max_length=10)
    disability_percentage = models.FloatField(blank=True, null=True)
    disability_type = models.CharField(max_length=255, blank=True, null=True)
    education = models.CharField(max_length=255)
    boardUniversity = models.CharField(max_length=255)
    passingYear = models.PositiveIntegerField()
    total_marks = models.CharField(max_length=255)
    obtained_marks = models.CharField(max_length=255)
    percentage = models.FloatField()
    residential_certificate_number = models.CharField(max_length=100,blank=True)
    residential_certificate_date = models.DateField(blank=True, null=True)
    category = models.CharField(max_length=255)
    caste_certificate_number = models.CharField(max_length=100,blank=True)
    caste_certificate_date = models.DateField(blank=True, null=True)
    application_status = models.CharField(max_length=255,blank=True)
    remarks = models.CharField(max_length=255, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    application_date = models.DateField(auto_now_add=True)
    # 2. Power Backup
    power_backup = models.CharField(max_length=255)
    center_location = models.CharField(max_length=255)
    net_connection = models.CharField(max_length=255)
    center_equipments = models.CharField(max_length=255)
    active_services=models.CharField(max_length=255 )
    # 2. Images
    image = models.ImageField(upload_to='jharsewa/images/', blank=True, null=True)
    signature = models.ImageField(upload_to='jharsewa/signatures/', blank=True, null=True)
    aadhar_card=models.ImageField(upload_to='jharsewa/aadhaar/', blank=True, null=True)
    pan_card=models.ImageField(upload_to='jharsewa/pancard/', blank=True, null=True)
    center_outside=models.ImageField(upload_to='jharsewa/centeroutside/', blank=True, null=True)
    center_inside=models.ImageField(upload_to='jharsewa/centerinside/', blank=True, null=True)
    computer_certificate=models.ImageField(upload_to='jharsewa/computercertificate/', blank=True, null=True)
    authorised_certificate=models.ImageField(upload_to='jharsewa/authorisedcertificate/', blank=True, null=True)
    application_form=models.ImageField(upload_to='jharsewa/applicationform/', blank=True, null=True)


    declaration = models.BooleanField(default=True)
    
    # 3. Additional details of candidate
    is_ex_serviceman = models.BooleanField(default=False)
    has_criminal_case = models.BooleanField(default=False)
    criminal_case_details = models.TextField(blank=True, null=True)
    identification_mark_1 = models.CharField(max_length=255, blank=True)
    identification_mark_2 = models.CharField(max_length=255, blank=True)
    nationality = models.CharField(max_length=255, blank=True)
    

    
    def __str__(self):
        return f"{self.applicantName}'s Application Information"

class Complaint(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('accepted', 'Accepted by Department'),
        ('rejected', 'Rejected by Department'),
        ('forwarded', 'Forwarded to Sub-office'),
        ('admin_review', 'Under Admin Review'),
        ('disposed', 'Disposed by Admin'),
    ]

    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="complaints")
    name = models.CharField(max_length=255, blank=True, null=True)
    mobile_number = models.CharField(max_length=15, blank=True, null=True)
    email = models.EmailField(max_length=100, blank=True, null=True)
    village = models.CharField(max_length=255)
    panchyat = models.CharField(max_length=255)
    pin_code = models.CharField(max_length=6)
    post_office = models.CharField(max_length=255)
    police_station = models.CharField(max_length=255)
    district = models.CharField(max_length=255)
    correspondentAddress = models.TextField()
    category = models.IntegerField()
    complaint_text = models.TextField()
    resolution = models.TextField(null=True, blank=True)
    feedback = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    department = models.ForeignKey(Department, on_delete=models.SET_NULL, null=True, blank=True)
    status = models.CharField(max_length=50, choices=STATUS_CHOICES, default='pending')
    forwarded_to = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL, related_name='forwarded_complaints')
    forwarded_by = models.ForeignKey(User, null=True, blank=True, on_delete=models.SET_NULL, related_name='forwarded_by_user')
    forward_remarks = models.TextField(blank=True, null=True)
    rejection_remarks = models.TextField(blank=True, null=True)
    accept_remarks = models.TextField(blank=True, null=True)
    is_jantadarbar_complain = models.BooleanField(default=False)

class ComplaintImage(models.Model):
    IMAGE_TYPE_CHOICES = [
        ('complaint', 'Complaint Image'),
        ('resolution', 'Resolution Image'),
    ]

    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name='images')
    image = models.ImageField(upload_to='complaint_images/')
    uploaded_at = models.DateTimeField(auto_now_add=True)
    image_type = models.CharField(max_length=20, choices=IMAGE_TYPE_CHOICES, default='complaint')  # Default set

# class ComplaintImage(models.Model):
#     complaint = models.ForeignKey(Complaint, related_name='images', on_delete=models.CASCADE)
#     image = models.ImageField(upload_to='complaint_images/')
#     def __str__(self):
#         return self.name

class ComplaintAction(models.Model):
    complaint = models.ForeignKey(Complaint, on_delete=models.CASCADE, related_name="actions")
    performed_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=50)  # e.g., accepted, rejected, forwarded, disposed
    remarks = models.TextField(null=True, blank=True)
    timestamp = models.DateTimeField(auto_now_add=True)
    to_department = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)

    def __str__(self):
        return f"{self.action} on {self.complaint.id} by {self.performed_by}"
