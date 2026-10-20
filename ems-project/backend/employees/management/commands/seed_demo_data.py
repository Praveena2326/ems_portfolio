from datetime import date

from django.conf import settings
from django.contrib.auth.models import User
from django.core.management.base import BaseCommand

from employees.models import Department, Designation, Employee


EMPLOYEES = """
EMP-1001|Vignesh|T|IT|Data Scientist|M|82000
EMP-1002|Praveena|S|IT|Software Developer|F|74000
EMP-1003|Thamarai Selvi|K|IT|Software Tester|F|65000
EMP-1004|Aarav|Mehta|IT|Software Engineer|M|78000
EMP-1005|Maya|Rao|IT|Product Designer|F|72000
EMP-1006|Karthik|Iyer|IT|QA Engineer|M|66000
EMP-1007|Nisha|Kapoor|IT|Data Analyst|F|69000
EMP-1008|Rohan|Shah|IT|Engineering Manager|M|98000
EMP-1009|Ananya|Menon|HR|HR Manager|F|82000
EMP-1010|Vikram|Nair|HR|People Operations Specialist|M|58000
EMP-1011|Priya|Desai|HR|Talent Partner|F|63000
EMP-1012|Arjun|Bose|HR|Learning Coordinator|M|52000
EMP-1013|Ishita|Sen|MARKETING|Marketing Manager|F|79000
EMP-1014|Dev|Malhotra|MARKETING|Content Strategist|M|61000
EMP-1015|Kavya|Pillai|MARKETING|Growth Specialist|F|64000
EMP-1016|Rahul|Verma|MARKETING|Brand Designer|M|60000
EMP-1017|Sneha|Joshi|FINANCE|Finance Manager|F|87000
EMP-1018|Aditya|Kulkarni|FINANCE|Financial Analyst|M|68000
EMP-1019|Meera|Sethi|FINANCE|Accounts Executive|F|54000
EMP-1020|Siddharth|Gupta|FINANCE|Payroll Specialist|M|59000
EMP-1021|Aisha|Khan|NON IT|Operations Manager|F|76000
EMP-1022|Manish|Patel|NON IT|Customer Success Lead|M|65000
EMP-1023|Diya|Thomas|NON IT|Client Support Executive|F|48000
EMP-1024|Harish|Reddy|NON IT|Office Administrator|M|45000
EMP-1025|Neha|Agarwal|IT|Frontend Developer|F|70000
EMP-1026|Sanjay|Das|IT|Backend Developer|M|74000
EMP-1027|Pooja|Bhat|HR|Recruiter|F|56000
EMP-1028|Aman|Singh|MARKETING|Social Media Specialist|M|51000
EMP-1029|Riya|Chopra|FINANCE|Accounts Associate|F|50000
EMP-1030|Varun|Mittal|NON IT|Customer Support Associate|M|47000
""".strip().splitlines()


class Command(BaseCommand):
    help = 'Creates or updates the portfolio demo employees and optional demo administrator.'

    def handle(self, *args, **options):
        for row in EMPLOYEES:
            employee_id, first_name, last_name, department_name, title, gender, salary = row.split('|')
            status = 'ON_LEAVE' if employee_id in {'EMP-1007', 'EMP-1016'} else 'ACTIVE'
            department, _ = Department.objects.get_or_create(
                name=department_name,
                defaults={'description': f'{department_name.title()} team'},
            )
            designation, _ = Designation.objects.get_or_create(
                title=title,
                defaults={'department': department},
            )
            Employee.objects.update_or_create(
                employee_id=employee_id,
                defaults={
                    'first_name': first_name,
                    'last_name': last_name,
                    'email': f'{employee_id.lower()}@ems-demo.example',
                    'phone': f'+9198{int(employee_id[-4:]):08d}',
                    'gender': gender,
                    'date_of_birth': date(1994, 1, 1),
                    'address': 'Bengaluru, India',
                    'department': department,
                    'designation': designation,
                    'date_joined': date(2022, 6, 1),
                    'salary': salary,
                    'status': status,
                },
            )

        username = getattr(settings, 'DEMO_ADMIN_USERNAME', None)
        password = getattr(settings, 'DEMO_ADMIN_PASSWORD', None)
        if username and password:
            user, created = User.objects.get_or_create(username=username)
            user.is_staff = True
            user.is_superuser = True
            user.set_password(password)
            user.save()
            self.stdout.write(self.style.SUCCESS(f"Demo administrator {'created' if created else 'updated'}: {username}"))

        self.stdout.write(self.style.SUCCESS(f'Portfolio data ready: {Employee.objects.count()} employees.'))
