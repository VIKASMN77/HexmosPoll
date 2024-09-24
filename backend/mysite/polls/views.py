from django.http import JsonResponse

from django.shortcuts import get_object_or_404

from django.db.models import Prefetch
from .models import Question, Choice, Tag
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

from django.utils import timezone
import json
from django.http import JsonResponse

@csrf_exempt
@require_http_methods(["GET", "POST"])
def polls_controller(request,id=False):
    
    if request.method == 'GET':
        # Fetch all polls
        questions = Question.objects.order_by('-pub_date').prefetch_related(
            Prefetch('choices', queryset=Choice.objects.all(), to_attr='choices_for_question'),
            Prefetch('tags', queryset=Tag.objects.all(), to_attr='tags_for_question')
        )

        response_data = []
        for question in questions:
            choices_for_question = {choice.choice_text: choice.votes for choice in getattr(question, 'choices_for_question', [])}
            tags_for_question = [tag.name for tag in getattr(question, 'tags_for_question', [])]

            question_data = {
                'question_id': question.id,
                'question_text': question.question_text,
                'OptionVote': choices_for_question,
                'tags': tags_for_question,
            }

            response_data.append(question_data)

        return JsonResponse({'data': response_data}, status=200)

    elif request.method == 'POST':
        # Create a new poll
        try:
            json_data = json.loads(request.body)
            question_text = json_data.get('Question')
            option_votes = json_data.get('OptionVote', {})
            tags = json_data.get('Tags', [])
            
            # Create the question object
            pub_date = timezone.now()
            question = Question.objects.create(
                question_text=question_text,
                pub_date=pub_date
            )
            
            # Create choice objects for each option vote
            for option, votes in option_votes.items():
                Choice.objects.create(
                    question=question,
                    choice_text=option,
                    votes=votes
                )
            
            # Create tag objects for each tag
            for tag_name in tags:
                Tag.objects.create(
                    question=question,
                    name=tag_name
                )

            return JsonResponse({'msg': 'Poll created successfully', 'success': True}, status=201)
        
        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
@csrf_exempt
def create_poll(request):
    if request.method == 'GET':
        return JsonResponse({
            'msg': 'GET request received. Use POST to create a poll.',
            'success': True
        })

    elif request.method == 'POST':
        try:
            json_data = json.loads(request.body)
            question_text = json_data.get('Question')
            option_votes = json_data.get('OptionVote', {})
            tags = json_data.get('Tags', [])

            # Create the question object
            pub_date = timezone.now()
            question = Question.objects.create(
                question_text=question_text,
                pub_date=pub_date
            )

            # Create choice objects for each option vote
            for option, votes in option_votes.items():
                Choice.objects.create(
                    question=question,
                    choice_text=option,
                    votes=votes
                )

            # Create tag objects for each tag
            for tag_name in tags:
                tag, created = Tag.objects.get_or_create(
                    question=question,
                    name=tag_name
                )
                if created:
                    tag.save()  # Save the tag if it was created

            return JsonResponse({'msg': 'Poll created successfully', 'success': True}, status=201)

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON data'}, status=400)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)




def fetch_polls_by_tags(request):
    tags_param = request.GET.get('tags')
    if not tags_param:
        return JsonResponse({'error': 'Tags parameter is required.'}, status=400)

    tag_names = tags_param.split(',')
    questions = Question.objects.filter(tags__name__in=tag_names).distinct().prefetch_related(
        Prefetch('choices', queryset=Choice.objects.all(), to_attr='choices_for_question'),
        Prefetch('tags', queryset=Tag.objects.all(), to_attr='tags_for_question')
    )

    response_data = []
    for question in questions:
        choices_for_question = {choice.choice_text: choice.votes for choice in question.choices_for_question}
        tags_for_question = [tag.name for tag in question.tags_for_question]

        question_data = {
            'question_id': question.id,
            'question_text': question.question_text,
            'choices': choices_for_question,
            'tags': tags_for_question,
        }

        response_data.append(question_data)

    return JsonResponse(response_data, safe=False)





def get_all_tags(request):
    if request.method == 'GET':
        # Fetch all tags
        tags = Tag.objects.all().values_list('name', flat=True).distinct()
        
        # Prepare response data
        response_data = {
           
            'data': list(tags),
            
        }

        return JsonResponse(response_data)
    else:
        return JsonResponse({'error': 'Method not allowed'}, status=405)
    
def poll_detail(request, id):
    if request.method == 'GET':
        question = get_object_or_404(Question, pk=id)
        choices = Choice.objects.filter(question=question)
        tags = Tag.objects.filter(question=question)

        choices_for_question = {choice.choice_text: choice.votes for choice in choices}
        tags_for_question = [tag.name for tag in tags]

        question_data = {
            'Question': question.question_text,
            'QuestionID': question.id,
            'Tags': tags_for_question,
            'OptionVote': choices_for_question,
        }

        return JsonResponse(status=200)
    
    return JsonResponse({'error': 'Method not allowed'}, status=405)
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.shortcuts import get_object_or_404
import json
from .models import Question, Choice, Tag

@csrf_exempt
@require_http_methods(["GET", "PUT"])
def poll_view(request, id=None):
    if request.method == 'GET':
        if id:
            # Fetch a specific poll by ID
            question = get_object_or_404(Question, pk=id)
            choices = Choice.objects.filter(question=question)
            tags = Tag.objects.filter(question=question)

            choices_for_question = {choice.choice_text: choice.votes for choice in choices}
            tags_for_question = [tag.name for tag in tags]

            question_data = {
                'Question': question.question_text,
                'QuestionID': question.id,
                'Tags': tags_for_question,
                'OptionVote': choices_for_question,
            }

            return JsonResponse({'msg': 'Fetched poll successfully', 'data': question_data, 'success': True}, status=200)

        else:
            # Fetch all polls
            questions = Question.objects.all()
            all_questions_data = []

            for question in questions:
                choices = Choice.objects.filter(question=question)
                tags = Tag.objects.filter(question=question)

                choices_for_question = {choice.choice_text: choice.votes for choice in choices}
                tags_for_question = [tag.name for tag in tags]

                question_data = {
                    'Question': question.question_text,
                    'QuestionID': question.id,
                    'Tags': tags_for_question,
                    'OptionVote': choices_for_question,
                }

                all_questions_data.append(question_data)

            return JsonResponse({ 'data': all_questions_data}, status=200)

    elif request.method == 'PUT':
        try:
            payload = json.loads(request.body)
            increment_option = payload.get('incrementOption')

            if not increment_option:
                return JsonResponse({'error': 'No option provided to increment'}, status=400)

            question = get_object_or_404(Question, pk=id)
            choice = get_object_or_404(Choice, question=question, choice_text=increment_option)

            choice.votes += 1
            choice.save()

            return JsonResponse({
                'msg': 'Poll updated successfully',
                'success': True
            })

        except json.JSONDecodeError:
            return JsonResponse({'error': 'Invalid JSON format'}, status=400)
        except Exception as e:
            return JsonResponse({'error': str(e)}, status=500)
