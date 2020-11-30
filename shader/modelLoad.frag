#version 330 core
in vec2 TexCoords;
in vec3 Normal;
in vec3 FragPos;
out vec4 color;

uniform samplerCube envText;			// ��������
uniform sampler2D texture_diffuse1;
uniform sampler2D texture_normal1;
uniform sampler2D texture_specular1;
uniform sampler2D texture_reflection1;	// ����map
uniform vec3 cameraPos;					//��Ҫλ�ü��㷴�䷽��
/*
	ͨ������ģ���е�reflection map��
	������Ⱦ���������Ĳ�����Ҫ�����价����ͼ�Լ�������ͼ��ǿ��ϵ����
	��������������������������ִ�з��价����ͼ
*/
void main()
{
    // diffuse
    vec4 diffuse = texture(texture_diffuse1, TexCoords);   //���������
    
    // specular
   // vec4 specular = texture(texture_specular1, TexCoords);		//���淴�����
    
	//norm 
    vec4 normal = texture(texture_normal1, TexCoords);			//�������������������ͼ��δ�ɹ����˴�δ��ֵ�������ɺ���
    
	//reflect
	vec3 viewDir = normalize(FragPos - cameraPos);       //����
	vec3 reflectDir = reflect(viewDir,  normalize(Normal));
	float	relefctIntensity = texture(texture_reflection1, TexCoords).r; 
	vec4 reflect = texture(envText, reflectDir) * relefctIntensity;	// ʹ�÷������������������� ʹ��ǿ��ϵ������
	
    color = diffuse  + reflect + normal;			//������ͼ���
    //color = vec4(1.0f, 1.0f, 1.0f, 1.0f);
}
