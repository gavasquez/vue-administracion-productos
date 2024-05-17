import { CreateUpdateProductAction, getProductById } from '@/modules/products/actions';
import { useMutation, useQuery } from '@tanstack/vue-query';
import { defineComponent, ref, watch, watchEffect } from 'vue';
import { useRouter } from 'vue-router';
import { useFieldArray, useForm } from 'vee-validate';
import * as yup from 'yup';
import CustomInput from '@/modules/common/components/CustomInput.vue';
import CustomTextArea from '@/modules/common/components/CustomTextArea.vue';
import { useToast } from 'vue-toastification';

const validationSchema = yup.object({
  title: yup.string().required('Este campo es super importante').min(3, 'Mínimo de 3 letras!!!'),
  slug: yup.string().required(),
  description: yup.string().required(),
  price: yup.number().required(),
  stock: yup.number().min(1).required(),
  gender: yup.string().required().oneOf(['men', 'women', 'kid']),
});

export default defineComponent({
  components: {
    CustomInput,
    CustomTextArea,
  },
  props: {
    productId: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const router = useRouter();
    const toast = useToast();

    const {
      data: product,
      isError,
      isLoading,
      refetch,
    } = useQuery({
      queryKey: ['products', props.productId],
      queryFn: () => getProductById(props.productId),
      // No queremos que vuelva a intentarlo si falla
      retry: false,
    });

    const {
      isPending,
      isSuccess: isUpdateSuccess,
      data: updatedProduct,
      mutate,
    } = useMutation({
      mutationFn: CreateUpdateProductAction,
    });

    const { values, defineField, errors, handleSubmit, resetForm, meta } = useForm({
      validationSchema: validationSchema,
      //initialValues: product.value,
    });

    const [title, titleAttrs] = defineField('title');
    const [slug, slugAttrs] = defineField('slug');
    const [description, descriptionAttrs] = defineField('description');
    const [price, priceAttrs] = defineField('price');
    const [stock, stockAttrs] = defineField('stock');
    const [gender, genderAttrs] = defineField('gender');

    const { fields: sizes, remove: removeSize, push: pushSize } = useFieldArray<string>('sizes');
    const { fields: images } = useFieldArray<string>('images');

    const imageFields = ref<File[]>([]);

    const onSubmit = handleSubmit((values) => {
      const formValues = {
        ...values,
        images: [...values.images, ...imageFields.value],
      };
      mutate(formValues);
    });

    watchEffect(() => {
      if (isError.value && !isLoading.value) {
        router.replace('/admin/products');
      }
    });

    //* watch para que este pendiente de la propiedad reactiva de product
    watch(
      product,
      () => {
        if (!product) return;
        resetForm({
          values: product.value,
        });
      },
      //* Que este pendiente de las propiedades internas
      {
        deep: true,
        //* Que se dispare apenas se construya
        immediate: true,
      },
    );

    const toogleSize = (size: string) => {
      const currentSizes = sizes.value.map((s) => s.value);
      const hasSizes = currentSizes.includes(size);
      if (hasSizes) {
        removeSize(currentSizes.indexOf(size));
      } else {
        pushSize(size);
      }
    };

    const onFileChange = (event: Event) => {
      const fileInput = event.target as HTMLInputElement;
      const fileList = fileInput.files;
      if (!fileList) return;
      if (fileList.length === 0) return;
      for (const imageFile of fileList) {
        imageFields.value.push(imageFile);
      }
    };

    watch(isUpdateSuccess, (value) => {
      if (!value) return;
      toast.success('Producto actualizado correctamente');
      // TODO redireccion cuando se crea

      //* Restablecemos el valor del formulario
      router.replace(`/admin/products/${updatedProduct.value!.id}`);
      resetForm({
        values: updatedProduct.value,
      });
      imageFields.value = [];
    });

    watch(
      () => props.productId,
      () => {
        refetch();
      },
    );

    return {
      // Propiedades
      values,
      errors,
      meta,
      /*  */
      title,
      titleAttrs,
      slug,
      slugAttrs,
      description,
      descriptionAttrs,
      price,
      priceAttrs,
      stock,
      stockAttrs,
      gender,
      genderAttrs,
      images,
      sizes,
      isPending,
      imageFields,
      //getters
      allSizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
      temporalImageUrl: (imageFile: File) => {
        return URL.createObjectURL(imageFile);
      },
      // Actions
      onFileChange,
      onSubmit,
      toogleSize,
      hasSize: (size: string) => {
        const currentSize = sizes.value.map((s) => s.value);
        return currentSize.includes(size);
      },
    };
  },
});
